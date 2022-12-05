import type * as DDeno from 'discordeno';
import moment from 'moment';
import 'moment-duration-format';
import * as jobs from 'node-schedule';
import client from '../../../BaseClient/DDenoClient.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';
import ReactionCollector from '../../../BaseClient/Other/ReactionCollector.js';

export default async (msg: CT.MessageGuild) => {
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

const doSelfAFKCheck = async (msg: CT.MessageGuild) => {
  const afkRow = await getAfkRow(msg);
  if (!afkRow) return;
  const isOldEnoug = Number(afkRow.since) + 60000 < Date.now();

  if (!isOldEnoug) return;

  const embed = await getAFKdeletedEmbed(msg, afkRow);
  const m = await client.ch.replyMsg(msg, { embeds: [embed] });
  jobs.scheduleJob(new Date(Date.now() + 30000), async () => {
    if (m) {
      client.helpers
        .deleteMessage(m.channelId, m.id, msg.language.deleteReasons.afk)
        .catch(() => null);
    }
  });

  handleReactions(msg, m);
  deleteM(m, msg);
  deleteAfk(msg);
  deleteNickname(msg);
};

const doMentionAFKcheck = (msg: CT.MessageGuild) => {
  msg.mentionedUserIds.forEach(async (mention) => {
    const afkRow = await getAfkRow(msg, mention);
    if (!afkRow) return;

    const embed = await getIsAFKEmbed(msg, mention, afkRow);
    const m = await client.ch.replyMsg(msg, { embeds: [embed] });
    jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
      if (m) {
        client.helpers
          .deleteMessage(m.channelId, m.id, msg.language.deleteReasons.afk)
          .catch(() => null);
      }
    });
  });
};

const getIsAFKEmbed = async (msg: CT.MessageGuild, id: bigint, afkRow: DBT.afk) => {
  const embed: DDeno.Embed = {
    color: await client.ch.colorSelector(await client.cache.members.get(client.id, msg.guildId)),
    footer: {
      text: msg.language.commands.afk.footer(id, getTime(afkRow, msg.language)),
    },
  };

  if (afkRow.text) embed.description = afkRow.text;

  return embed;
};

const getAfkRow = (msg: CT.MessageGuild, mention?: bigint) =>
  client.ch
    .query('SELECT * FROM afk WHERE userid = $1 AND guildid = $2;', [
      String(mention || msg.authorId),
      String(msg.guildId),
    ])
    .then((r: DBT.afk[] | null) => (r ? r[0] : null));

const getTime = (afkRow: DBT.afk, language: CT.Language) =>
  moment
    .duration(Number(afkRow.since) - Date.now())
    .format(
      ` D [${language.time.days}], H [${language.time.hours}], m [${language.time.minutes}], s [${language.time.seconds}]`,
      { trim: 'all' },
    )
    .replace(/-/g, '');

const deleteNickname = async (msg: CT.MessageGuild) => {
  const displayname = msg.member.nick ?? msg.author.username;

  if (!msg.member.nick || !msg.member.nick.endsWith(' [AFK]')) return;
  const newNickname = displayname.slice(0, displayname.length - 6);

  if (!client.ch.isManageable(msg.member, await client.cache.members.get(client.id, msg.guildId))) {
    return;
  }

  client.helpers.editMember(msg.guildId, msg.authorId, { nick: newNickname }).catch(() => null);
};

const deleteAfk = (msg: CT.MessageGuild) =>
  client.ch.query('DELETE FROM afk WHERE userid = $1 AND guildid = $2;', [
    String(msg.authorId),
    String(msg.guildId),
  ]);

const deleteM = (m: DDeno.Message | null, msg: CT.MessageGuild) => {
  if (m && m.embeds.length > 1) {
    jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
      client.helpers
        .deleteMessage(m.channelId, m.id, msg.language.deleteReasons.afk)
        .catch(() => null);
    });
  }
};

const getAFKdeletedEmbed = async (msg: CT.MessageGuild, afkRow: DBT.afk): Promise<DDeno.Embed> => ({
  color: await client.ch.colorSelector(await client.cache.members.get(client.id, msg.guildId)),
  footer: {
    text: msg.language.commands.afkHandler.footer(getTime(afkRow, msg.language)),
  },
});

const handleReactions = async (msg: CT.Message, m: DDeno.Message | null) => {
  if (!m) return;
  const emote = `${client.objectEmotes.cross.name}:${client.objectEmotes.cross.id}`;

  const reaction = await client.helpers.addReaction(msg.channelId, m.id, emote).catch(() => null);
  if (!reaction) return;

  const reactionsCollector = new ReactionCollector(m, msg.channel, 20000);

  reactionsCollector.on('end', (reason) => {
    if (reason === 'time') {
      client.helpers.deleteReactionsEmoji(m.channelId, m.id, emote).catch(() => null);
    }
  });

  reactionsCollector.on('collect', (_r, user) => {
    if (user.id !== msg.author.id) return;

    client.helpers
      .deleteMessage(m.channelId, m.id, msg.language.deleteReasons.afk)
      .catch(() => null);
  });
};
