import * as Discord from 'discord.js';
import * as jobs from 'node-schedule';
import { ch, client } from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';

export default async (msg: CT.GuildMessage) => {
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

const doSelfAFKCheck = async (msg: CT.GuildMessage) => {
  const afkRow = await getAfkRow(msg);
  if (!afkRow) return;
  const isOldEnoug = Number(afkRow.since) + 60000 < Date.now();

  if (!isOldEnoug) return;

  const embed = await getAFKdeletedEmbed(msg, afkRow);
  const m = await ch.replyMsg(msg, { embeds: [embed] });
  jobs.scheduleJob(new Date(Date.now() + 30000), async () => {
    if (m) m.delete().catch(() => null);
  });

  handleReactions(msg, m);
  deleteM(m);
  deleteAfk(msg);
  deleteNickname(msg);
};

const doMentionAFKcheck = (msg: CT.GuildMessage) => {
  msg.mentions.users.forEach(async (mention) => {
    const afkRow = await getAfkRow(msg, mention);
    if (!afkRow) return;

    const embed = await getIsAFKEmbed(msg, mention, afkRow);
    const m = await ch.replyMsg(msg, { embeds: [embed] });
    jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
      if (m) m.delete().catch(() => null);
    });
  });
};

const getIsAFKEmbed = async (msg: CT.GuildMessage, mention: Discord.User, afkRow: DBT.afk) => {
  const embed: Discord.APIEmbed = {
    color: ch.colorSelector(
      client.user ? await msg.guild.members.fetch(client.user?.id) : undefined,
    ),
    footer: {
      text: msg.language.commands.afk.footer(mention.id, getTime(afkRow, msg.language)),
    },
  };

  if (afkRow.text) embed.description = afkRow.text;

  return embed;
};

const getAfkRow = (msg: CT.GuildMessage, mention?: Discord.User) =>
  ch
    .query('SELECT * FROM afk WHERE userid = $1 AND guildid = $2;', [
      String(mention || msg.author.id),
      String(msg.guild.id),
    ])
    .then((r: DBT.afk[] | null) => (r ? r[0] : null));

const getTime = (afkRow: DBT.afk, language: CT.Language) =>
  ch.moment(Math.abs(Number(afkRow.since) - Date.now()), language);

const deleteNickname = async (msg: CT.GuildMessage) => {
  const displayname = msg.member.nickname ?? msg.author.username;

  if (!msg.member.nickname || !msg.member.nickname.endsWith(' [AFK]')) return;
  const newNickname = displayname.slice(0, displayname.length - 6);

  if (!msg.member.manageable) return;

  msg.member.setNickname(newNickname).catch(() => null);
};

const deleteAfk = (msg: CT.GuildMessage) =>
  ch.query('DELETE FROM afk WHERE userid = $1 AND guildid = $2;', [
    msg.author.id,
    msg.guild.id,
  ]);

const deleteM = (m?: Discord.Message) => {
  if (m && m.embeds.length > 1) {
    jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
      if (m) m.delete().catch(() => null);
    });
  }
};

const getAFKdeletedEmbed = async (
  msg: CT.GuildMessage,
  afkRow: DBT.afk,
): Promise<Discord.APIEmbed> => ({
  color: ch.colorSelector(
    client.user ? await msg.guild.members.fetch(client.user.id) : undefined,
  ),
  footer: {
    text: msg.language.commands.afkHandler.footer(getTime(afkRow, msg.language)),
  },
});

const handleReactions = async (msg: CT.GuildMessage, m?: Discord.Message) => {
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
