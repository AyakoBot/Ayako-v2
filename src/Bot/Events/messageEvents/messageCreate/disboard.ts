import jobs from 'node-schedule';
import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msg: CT.MessageGuild) => {
  if (msg.author.id !== 302050872383242240n) return;
  if (!msg.embeds[0]) return;
  if (!msg.embeds[0].color) return;
  if (!msg.embeds[0].image?.url?.includes('bot-command-image-bump.png')) return;

  const settings = await getSettings(msg.guild);
  if (!settings) return;

  const channel = settings.channelid
    ? msg.guild.channels.get(BigInt(settings.channelid))
    : msg.channel;
  if (!channel) return;

  client.disboardBumpReminders.get(String(msg.guildId))?.cancel();
  client.disboardBumpReminders.delete(String(msg.guildId));

  await client.helpers
    .addReaction(msg.channelId, msg.id, client.stringEmotes.tick)
    .catch(() => null);

  await client.ch.query(
    `UPDATE disboard SET nextbump = $1, tempchannelid = $2 WHERE guildid = $3;`,
    [msg.timestamp + 7200000, String(channel.id), String(msg.guildId)],
  );

  if (settings.deletereply) {
    client.helpers
      .deleteMessage(msg.channelId, msg.id, msg.language.deleteReasons.deleteReply)
      .catch(() => null);
  }

  setReminder(msg, true, settings);
};

const getSettings = async (guild: DDeno.Guild) =>
  client.ch
    .query('SELECT * FROM disboard WHERE guildid = $1 AND active = true;', [String(guild.id)])
    .then((r: DBT.disboard[] | null) => (r ? r[0] : null));

const setReminder = async (msg: CT.MessageGuild, isBump: boolean, settings: DBT.disboard) => {
  if (!isBump && !Number(settings.repeatreminder)) {
    client.ch.query(`UPDATE disboard SET nextbump = NULL WHERE guildid = $1;`, [
      String(msg.guildId),
    ]);
    return;
  }

  await doDelete(msg, settings);

  client.ch.query(`UPDATE disboard SET nextbump = $1 WHERE guildid = $2;`, [
    Date.now() + (isBump ? 7200000 : Number(settings.repeatreminder) * 60 * 1000),
    String(msg.guildId),
  ]);

  client.disboardBumpReminders.set(
    String(msg.guildId),
    jobs.scheduleJob(
      new Date(Date.now() + (isBump ? 7200000 : Number(settings.repeatreminder) * 60 * 1000)),
      () => {
        endReminder(msg);
      },
    ),
  );
};

export const endReminder = async (msg: CT.MessageGuild) => {
  const settings = await getSettings(msg.guild);
  if (!settings) return;

  let channel: DDeno.Channel | undefined;
  if (settings.channelid) {
    channel = await client.cache.channels.get(BigInt(settings.channelid));
  } else if (settings.tempchannelid) {
    channel = await client.cache.channels.get(BigInt(settings.tempchannelid));
  } else return;
  if (!channel) return;

  const lan = msg.language.events.ready.disboard;

  const embed: DDeno.Embed = {
    author: {
      name: lan.title,
      iconUrl:
        'https://cdn.discordapp.com/avatars/302050872383242240/67342a774a9f2d20d62bfc8553bb98e0.png?size=4096',
      url: client.customConstants.standard.invite,
    },
    description: lan.desc,
    color: await client.ch.colorSelector(await client.helpers.getMember(msg.guildId, client.id)),
  };

  const users = settings.users?.map((u) => `<@${u}>`).join(', ') || '';
  const roles = settings.roles?.map((r) => `<@&${r}>`).join(', ') || '';

  const m = await client.ch.send(
    channel,
    { embeds: [embed], content: `${users}\n${roles}` },
    msg.language,
  );
  if (!m || Array.isArray(m)) return;

  await client.ch.query(`UPDATE disboard SET msgid = $1 WHERE guildid = $2;`, [
    String(m.id),
    String(msg.guildId),
  ]);

  setReminder(msg, false, settings);
};

const doDelete = async (msg: CT.MessageGuild, settings: DBT.disboard) => {
  if (!settings.deletereply) return;
  if (!settings.msgid) return;
  if (!settings.tempchannelid) return;

  const channel = settings.channelid
    ? await client.cache.channels.get(BigInt(settings.channelid))
    : await client.cache.channels.get(BigInt(settings.tempchannelid));

  if (!channel) return;

  const message = await client.cache.messages.get(BigInt(settings.msgid), channel.id, msg.guildId);
  if (!message) return;

  client.helpers
    .deleteMessage(channel.id, message.id, msg.language.deleteReasons.disboard)
    .catch(() => null);
};
