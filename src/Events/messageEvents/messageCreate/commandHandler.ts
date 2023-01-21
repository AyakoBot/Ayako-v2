import * as Discord from 'discord.js';
import fs from 'fs';
import * as jobs from 'node-schedule';
import type * as CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import auth from '../../../auth.json' assert { type: 'json' };
import client from '../../../BaseClient/Client.js';

const execute = async (msg: CT.Message) => {
  const prefix = await getPrefix(msg);
  if (!prefix) return;

  const args = msg.content.replace(/\\n/g, ' ').slice(prefix.length).split(/ +/);

  const { file: command, triedCMD } = await getCommand(args);
  if (!command) return;

  if (!('guildId' in msg) || !msg.guild || msg.channel.type === 1) {
    runDMCommand({ msg, command }, triedCMD);
    return;
  }

  if (command.dmOnly) {
    client.ch.errorMsg(msg, msg.language.commands.commandHandler.DMonly, msg.language);
    return;
  }

  if (msg.author.id !== auth.ownerID && msg.guild) {
    const proceed = runChecks(msg as CT.GuildMessage, command);
    if (!proceed) return;
  }

  const proceedEdit = await editCheck(msg, command);
  if (!proceedEdit) return;

  commandExe(msg, command, triedCMD);
};

const runChecks = async (msg: CT.GuildMessage, command: CT.Command) => {
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
  { msg, command }: { msg: CT.Message; command: CT.Command },
  triedCMD?: unknown,
) => {
  if (command.dmAllowed) {
    commandExe(msg, command, triedCMD);
    return;
  }
  client.ch.errorMsg(msg, msg.language.commands.commandHandler.GuildOnly, msg.language);
};

export const getPrefix = async (msg: CT.Message | CT.GuildMessage) => {
  const prefixStandard = client.customConstants.standard.prefix;
  const prefixCustom = msg.guild ? await getCustomPrefix(msg as CT.GuildMessage) : undefined;

  let prefix;

  if (msg.content.toLowerCase().startsWith(prefixStandard)) prefix = prefixStandard;
  else if (prefixCustom && msg.content.toLowerCase().startsWith(prefixCustom)) {
    prefix = prefixCustom;
  } else return null;

  return prefix;
};

const getCustomPrefix = async (msg: CT.GuildMessage) =>
  client.ch
    .query(
      'SELECT prefix FROM guildsettings WHERE guildid = $1;',
      [msg.guild.id],
      msg.author.id === '564052925828038658',
    )
    .then((r: DBT.guildsettings[] | null) => (r ? r[0].prefix : null));

export const getCommand = async (args: string[]) => {
  const isDisallowed = (file: string) =>
    ['.d.ts', '.d.ts.map', '.js.map'].some((end) => file.endsWith(end));

  const dir = `${process.cwd()}/dist/Commands/TextCommands`;
  const files = fs.readdirSync(dir).filter((f) => !isDisallowed(dir) && f.endsWith('.js'));
  const searchedFileName = args.shift()?.toLowerCase();
  const possibleFiles = await Promise.all(files.map((f) => import(`${dir}/${f}`)));

  let triedCMD;
  const file: CT.Command = await files
    .map((_, i) => {
      const { default: possibleFile }: { default: CT.Command } = possibleFiles[i];
      if (
        searchedFileName &&
        (possibleFile.name === searchedFileName || possibleFile.aliases?.includes(searchedFileName))
      ) {
        if (possibleFile.takesFirstArg && !args[0]) {
          triedCMD = possibleFile;
          return import(`${dir}/cmdhelp`);
        }
        return possibleFile;
      }
      return null;
    })
    .filter((f) => !!f)
    .shift();

  return { file: file || null, triedCMD };
};

const getGuildAllowed = (msg: CT.GuildMessage, command: CT.Command) => {
  if (!msg.guild.id) return true;
  if (command.thisGuildOnly && !command.thisGuildOnly?.includes(msg.guild.id)) return false;
  return true;
};

const getCommandIsDisabled = async (msg: CT.GuildMessage, command: CT.Command) => {
  const getDisabledRows = async () =>
    client.ch
      .query('SELECT * FROM disabledcommands WHERE guildid = $1 AND active = true;', [msg.guild.id])
      .then((r: DBT.disabledcommands[] | null) => r || null);

  const checkDisabled = (rows: DBT.disabledcommands[]) => {
    const includingRows = rows
      .filter(
        (r) =>
          r.commands?.includes(command.name) &&
          (!r.channels?.length || r.channels?.includes(msg.channelId)) &&
          (!r.blroleid || msg.member.roles.cache.some((role) => r.blroleid?.includes(role.id))) &&
          (!r.bluserid || r.bluserid?.includes(msg.author.id)),
      )
      .filter(
        (r) =>
          !msg.member?.roles.cache.some((role) => r.bproleid?.includes(role.id)) &&
          !r.bpuserid?.includes(msg.author.id),
      );

    if (includingRows.length) return true;
    return false;
  };

  const disabledCommandRows = await getDisabledRows();
  if (disabledCommandRows && disabledCommandRows.length) {
    const disabled = checkDisabled(disabledCommandRows);
    if (disabled) return true;
  }
  return false;
};

const getPermAllowed = async (msg: CT.GuildMessage, command: CT.Command) => {
  if (command.perm === 0 && msg.author.id !== auth.ownerID) {
    client.ch.errorMsg(msg, msg.language.commands.commandHandler.creatorOnly, msg.language);
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

const getCooldown = async (msg: CT.GuildMessage, command: CT.Command) => {
  const onCooldown = (cl: clEntry) => {
    const getEmote = (secondsLeft: number) => {
      let returned = `**${client.ch.moment(secondsLeft * 1000, msg.language)}**`;
      let usedEmote = false;

      if (secondsLeft <= 60) {
        returned = `${client.stringEmotes.timers[secondsLeft]} **${msg.language.time.seconds}**`;
        usedEmote = true;
      }

      return { emote: returned, usedEmote };
    };

    const timeLeft = cl.expire - Date.now();
    const { emote, usedEmote } = getEmote(Math.ceil(timeLeft / 1000));

    client.ch
      .replyMsg(msg, {
        content: msg.language.commands.commandHandler.pleaseWait(emote),
      })
      .then((m) => {
        if (!usedEmote && m) {
          jobs.scheduleJob(new Date(Date.now() + (timeLeft - 60000)), () => {
            m.edit({
              content: msg.language.commands.commandHandler.pleaseWait(
                client.stringEmotes.timers[60],
              ),
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
    client.ch
      .query(`SELECT * FROM cooldowns WHERE guildid = $1 AND active = true AND command = $2;`, [
        msg.guild.id,
        command.name,
      ])
      .then((r: DBT.cooldowns[] | null) => r || null);

  const rows = await getCooldownRows();
  if (!rows) return false;

  const applyingRows = rows.filter(
    (row) =>
      (!row.activechannelid?.length || row.activechannelid?.includes(msg.channelId)) &&
      !row.bpchannelid?.includes(msg.channelId) &&
      !row.bpuserid?.includes(msg.author.id) &&
      !row.bproleid?.some((r) => msg.member.roles.cache.has(r)),
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

const commandExe = async (msg: CT.Message, command: CT.Command, triedCMD?: unknown) => {
  const lan = msg.language.commands[command.name as keyof typeof msg.language.commands];

  try {
    // eslint-disable-next-line no-console
    command.execute(msg, { language: msg.language, lan }, command, { triedCMD });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[Command Error] ${command.name}:`, e);
  }
};

const editCheck = async (msg: CT.Message, command: CT.Command) => {
  if (!msg.editedTimestamp) return true;
  if (command.type !== 'mod') return true;

  const editVerifier = async () => {
    const buttons: Discord.ButtonBuilder[] = [
      new Discord.ButtonBuilder()
        .setCustomId('proceed')
        .setLabel(msg.language.mod.warning.proceed)
        .setStyle(Discord.ButtonStyle.Danger)
        .setEmoji(client.objectEmotes.warning),
      new Discord.ButtonBuilder()
        .setCustomId('abort')
        .setLabel(msg.language.mod.warning.abort)
        .setStyle(Discord.ButtonStyle.Secondary)
        .setEmoji(client.objectEmotes.cross),
    ];

    const m = await client.ch.replyMsg(msg, {
      content: msg.language.commands.commandHandler.verifyMessage,
      components: [new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(...buttons)],
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
          client.ch.notYours(interaction, msg.language);
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
