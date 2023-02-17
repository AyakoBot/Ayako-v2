import * as Discord from 'discord.js';
import * as jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';

export default async (msg: Discord.Message) => {
  const prefix = await (await import('./commandHandler.js')).getPrefix(msg);
  if (prefix) {
    const usedCommand: { file: CT.Command | null; triedCMD: undefined } = await (
      await import('./commandHandler.js')
    ).getCommand(msg.content.replace(/\\n/g, ' ').slice(prefix.length).split(/ +/));
    if (usedCommand.file?.name === 'afk') return;
  }

  doSelfAFKCheck(msg);
  doMentionAFKcheck(msg);
};

const doSelfAFKCheck = async (msg: Discord.Message) => {
  const afkRow = await getAfkRow(msg);
  if (!afkRow) return;
  const isOldEnoug = Number(afkRow.since) + 60000 < Date.now();

  if (!isOldEnoug) return;
  const language = await ch.languageSelector(msg.guildId);

  const embed = await getAFKdeletedEmbed(msg, afkRow, language);
  const m = await ch.replyMsg(msg, { embeds: [embed] });
  jobs.scheduleJob(new Date(Date.now() + 30000), async () => {
    if (m) m.delete().catch(() => null);
  });

  handleReactions(msg, m);
  deleteM(m);
  deleteAfk(msg);
  deleteNickname(msg);
};

const doMentionAFKcheck = (msg: Discord.Message) => {
  msg.mentions.users.forEach(async (mention) => {
    const afkRow = await getAfkRow(msg, mention);
    if (!afkRow) return;

    const language = await ch.languageSelector(msg.guildId);
    const embed = await getIsAFKEmbed(msg, mention, afkRow, language);
    const m = await ch.replyMsg(msg, { embeds: [embed] });
    jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
      if (m) m.delete().catch(() => null);
    });
  });
};

const getIsAFKEmbed = async (
  msg: Discord.Message,
  mention: Discord.User,
  afkRow: DBT.afk,
  language: CT.Language,
) => {
  const embed: Discord.APIEmbed = {
    color: ch.colorSelector(
      client.user ? await msg.guild?.members.fetch(client.user?.id) : undefined,
    ),
    footer: {
      text: language.commands.afk.footer(mention.id, getTime(afkRow, language)),
    },
  };

  if (afkRow.text) embed.description = afkRow.text;

  return embed;
};

const getAfkRow = (msg: Discord.Message, mention?: Discord.User) =>
  ch
    .query('SELECT * FROM afk WHERE userid = $1 AND guildid = $2;', [
      String(mention || msg.author.id),
      String(msg.guildId),
    ])
    .then((r: DBT.afk[] | null) => (r ? r[0] : null));

const getTime = (afkRow: DBT.afk, language: CT.Language) =>
  ch.moment(Math.abs(Number(afkRow.since) - Date.now()), language);

const deleteNickname = async (msg: Discord.Message) => {
  const displayname = msg.member?.nickname ?? msg.author.username;

  if (!msg.member?.nickname || !msg.member?.nickname.endsWith(' [AFK]')) return;
  const newNickname = displayname.slice(0, displayname.length - 6);

  if (!msg.member.manageable) return;

  msg.member.setNickname(newNickname).catch(() => null);
};

const deleteAfk = (msg: Discord.Message) =>
  ch.query('DELETE FROM afk WHERE userid = $1 AND guildid = $2;', [msg.author.id, msg.guildId]);

const deleteM = (m?: Discord.Message) => {
  if (m && m.embeds.length > 1) {
    jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
      if (m) m.delete().catch(() => null);
    });
  }
};

const getAFKdeletedEmbed = async (
  msg: Discord.Message,
  afkRow: DBT.afk,
  language: CT.Language,
): Promise<Discord.APIEmbed> => ({
  color: ch.colorSelector(client.user ? await msg.guild?.members.fetch(client.user.id) : undefined),
  footer: {
    text: language.commands.afkHandler.footer(getTime(afkRow, language)),
  },
});

const handleReactions = async (msg: Discord.Message, m?: Discord.Message) => {
  if (!m) return;
  const emote = `${ch.objectEmotes.cross.name}:${ch.objectEmotes.cross.id}`;

  const reaction = await m.react(emote).catch(() => null);
  if (!reaction) return;

  const reactionsCollector = new Discord.ReactionCollector(m, { time: 20000 });

  reactionsCollector.on('end', (_, reason) => {
    if (reason === 'time' && client.user) {
      m.reactions.cache
        .get(ch.objectEmotes.cross.id)
        ?.users.remove(client.user.id)
        .catch(() => null);
    }
  });

  reactionsCollector.on('collect', (r, user) => {
    if (r.emoji.id !== ch.objectEmotes.cross.id) return;
    if (user.id !== msg.author.id) return;

    m.delete().catch(() => null);
  });
};
