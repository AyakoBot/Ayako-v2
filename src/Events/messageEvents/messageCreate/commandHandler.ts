import * as Discord from 'discord.js';
import fs from 'fs';
import * as jobs from 'node-schedule';
import type * as CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import auth from '../../../auth.json' assert { type: 'json' };
import * as ch from '../../../BaseClient/ClientHelper.js';

const execute = async (msg: Discord.Message) => {
  const prefix = await getPrefix(msg);
  if (!prefix) return;

  const args = msg.content.replace(/\\n/g, ' ').slice(prefix.length).split(/ +/);

  const { file: command, triedCMD } = await getCommand(args);
  if (!command) return;

  if (!msg.inGuild()) {
    runDMCommand(msg, command, args, triedCMD);
    return;
  }

  if (command.dmOnly) {
    const language = await ch.languageSelector(msg.guildId);
    ch.errorMsg(msg, language.commands.commandHandler.DMonly, language);
    return;
  }

  if (msg.author.id !== auth.ownerID && msg.guild) {
    const proceed = runChecks(msg as Discord.Message, command);
    if (!proceed) return;
  }

  const proceedEdit = await editCheck(msg, command);
  if (!proceedEdit) return;

  commandExe(msg, command, args, triedCMD);
};

const runChecks = async (msg: Discord.Message, command: CT.Command) => {
  const guildAllowed = getGuildAllowed(msg, command);
  if (!guildAllowed) return false;

  const permAllowed = getPermAllowed(msg, command);
  if (!permAllowed) return false;

  const commandIsDisabled = await getCommandIsDisabled(msg, command);
  if (commandIsDisabled) return false;

  const hasCooldown = await getCooldown(msg, command);
  if (hasCooldown) return false;

  return true;
};

export default execute;

const runDMCommand = async (
  msg: Discord.Message,
  command: CT.Command,
  args?: string[],
  triedCMD?: unknown,
) => {
  if (command.dmAllowed) {
    commandExe(msg, command, args, triedCMD);
    return;
  }

  const language = await ch.languageSelector(msg.guildId);
  ch.errorMsg(msg, language.commands.commandHandler.GuildOnly, language);
};

export const getPrefix = async (msg: Discord.Message | Discord.Message) => {
  if (!msg.inGuild()) return;

  const prefixStandard = ch.constants.standard.prefix;
  const prefixCustom = msg.guild ? await getCustomPrefix(msg.guildId) : undefined;

  let prefix;

  if (msg.content.toLowerCase().startsWith(prefixStandard)) prefix = prefixStandard;
  else if (prefixCustom && msg.content.toLowerCase().startsWith(prefixCustom)) {
    prefix = prefixCustom;
  } else return null;

  return prefix;
};

const getCustomPrefix = async (id: string) =>
  ch
    .query('SELECT prefix FROM guildsettings WHERE guildid = $1;', [id])
    .then((r: DBT.guildsettings[] | null) => (r ? r[0].prefix : null));

export const getCommand = async (args: string[]) => {
  const isDisallowed = (file: string) =>
    ['.d.ts', '.d.ts.map', '.js.map'].some((end) => file.endsWith(end));

  const dir = `${process.cwd()}/Commands/TextCommands`;
  const files = fs.readdirSync(dir).filter((f) => !isDisallowed(dir) && f.endsWith('.js'));
  const searchedFileName = args.shift()?.toLowerCase();
  const possibleFiles = await Promise.all(files.map((f) => import(`${dir}/${f}`)));

  let triedCMD;
  const file: CT.Command = await files
    .map((_, i) => {
      const possibleFile: CT.Command = possibleFiles[i];
      if (
        searchedFileName &&
        (possibleFile.name === searchedFileName || possibleFile.aliases?.includes(searchedFileName))
      ) {
        if (possibleFile.takesFirstArg && !args[0]) {
          triedCMD = possibleFile;
          return import(`${dir}/cmdhelp.js`);
        }
        return possibleFile;
      }
      return null;
    })
    .filter((f) => !!f)
    .shift();

  return { file: file || null, triedCMD };
};

const getGuildAllowed = (msg: Discord.Message, command: CT.Command) => {
  if (!msg.inGuild()) return true;
  if (command.thisGuildOnly && !command.thisGuildOnly?.includes(msg.guildId)) return false;
  return true;
};

const getCommandIsDisabled = async (_msg: Discord.Message, _command: CT.Command) => {
  // TODO
  return false;
};

const getPermAllowed = async (msg: Discord.Message, command: CT.Command) => {
  if (command.perm === 0 && msg.author.id !== auth.ownerID) {
    const language = await ch.languageSelector(msg.guildId);

    ch.errorMsg(msg, language.commands.commandHandler.creatorOnly, language);
    return false;
  }
  return true;
};

type clEntry = {
  job: jobs.Job;
  channel: Discord.GuildTextBasedChannel;
  expire: number;
  command: CT.Command;
};
const cooldowns: clEntry[] = [];

const getCooldown = async (msg: Discord.Message, command: CT.Command) => {
  const language = await ch.languageSelector(msg.guildId);

  const onCooldown = (cl: clEntry) => {
    const getEmote = (secondsLeft: number) => {
      let returned = `**${ch.moment(secondsLeft * 1000, language)}**`;
      let usedEmote = false;

      if (secondsLeft <= 60) {
        returned = `${ch.stringEmotes.timers[secondsLeft]} **${language.time.seconds}**`;
        usedEmote = true;
      }

      return { emote: returned, usedEmote };
    };

    const timeLeft = cl.expire - Date.now();
    const { emote, usedEmote } = getEmote(Math.ceil(timeLeft / 1000));

    ch.replyMsg(msg, {
      content: language.commands.commandHandler.pleaseWait(emote),
    }).then((m) => {
      if (!usedEmote && m) {
        jobs.scheduleJob(new Date(Date.now() + (timeLeft - 60000)), () => {
          m.edit({
            content: language.commands.commandHandler.pleaseWait(ch.stringEmotes.timers[60]),
          });
        });
      }

      jobs.scheduleJob(new Date(cl.expire), () => {
        if (m) m.delete().catch(() => null);

        msg.delete().catch(() => null);
      });
    });
  };

  const getCooldownRows = async () =>
    ch
      .query(`SELECT * FROM cooldowns WHERE guildid = $1 AND active = true AND command = $2;`, [
        msg.guildId,
        command.name,
      ])
      .then((r: DBT.cooldowns[] | null) => r || null);

  const rows = await getCooldownRows();
  if (!rows) return false;

  const applyingRows = rows.filter(
    (row) =>
      (!row.activechannelid?.length || row.activechannelid?.includes(msg.channelId)) &&
      !row.wlchannelid?.includes(msg.channelId) &&
      !row.wluserid?.includes(msg.author.id) &&
      !row.wlroleid?.some((r) => msg.member?.roles.cache.has(r)),
  );

  const applyingCooldown = Math.max(...applyingRows.map((r) => Number(r.cooldown) * 1000));
  command.cooldown = applyingCooldown;

  if (msg.author.id !== auth.ownerID) {
    const cl = cooldowns.find(
      (c) => c.command.name === command.name && c.channel.id === msg.channel.id,
    );
    if (cl?.channel.id === msg.channel.id) {
      onCooldown(cl);
      return true;
    }
  }

  const expire = Date.now() + command.cooldown;
  cooldowns.push({
    job: jobs.scheduleJob(new Date(Date.now() + command.cooldown), () => {
      cooldowns.splice(
        cooldowns.findIndex((c) => c.expire === expire),
        1,
      );
    }),
    channel: msg.channel as Discord.GuildTextBasedChannel,
    command,
    expire,
  });

  return false;
};

const commandExe = async (
  msg: Discord.Message,
  command: CT.Command,
  args?: string[],
  triedCMD?: unknown,
) => {
  try {
    // eslint-disable-next-line no-console
    command.default(msg, command, args, { triedCMD });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[Command Error] ${command.name}:`, e);
  }
};

const editCheck = async (msg: Discord.Message, command: CT.Command) => {
  if (!msg.editedTimestamp) return true;
  if (command.type !== 'mod') return true;

  const language = await ch.languageSelector(msg.guildId);

  const editVerifier = async () => {
    const m = await ch.replyMsg(msg, {
      content: language.commands.commandHandler.verifyMessage,
      components: [
        {
          type: Discord.ComponentType.ActionRow,
          components: [
            {
              type: Discord.ComponentType.Button,
              style: Discord.ButtonStyle.Danger,
              label: language.mod.warning.proceed,
              custom_id: `proceed`,
              emoji: ch.objectEmotes.warning,
            },
            {
              type: Discord.ComponentType.Button,
              style: Discord.ButtonStyle.Secondary,
              label: language.mod.warning.abort,
              custom_id: `abort`,
              emoji: ch.objectEmotes.cross,
            },
          ],
        },
      ],
    });

    if (!m) return false;

    const buttonsCollector = new Discord.InteractionCollector(m.client, {
      message: m,
      time: 60000,
    });
    return new Promise((resolve) => {
      buttonsCollector.on('collect', (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.user.id !== msg.author.id) {
          ch.notYours(interaction, language);
          resolve(false);
          return;
        }

        buttonsCollector.stop();

        if (interaction.customId === 'abort') {
          m.delete().catch(() => null);
          msg.delete().catch(() => null);

          interaction.deferUpdate().catch(() => null);
          resolve(false);
          return;
        }

        if (interaction.customId === 'proceed') {
          interaction.deferUpdate().catch(() => null);
          resolve(true);
        }
      });

      buttonsCollector.on('end', (_, reason) => {
        if (reason === 'time') {
          m.delete().catch(() => null);
          msg.delete().catch(() => null);

          resolve(false);
        }
      });
    });
  };

  const proceed = await editVerifier();
  if (!proceed) return false;

  return true;
};
