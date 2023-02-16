import jobs from 'node-schedule';
import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import { ch, client } from '../../../BaseClient/Client.js';

export default async (msg: CT.GuildMessage) => {
  if (msg.author.id !== '302050872383242240') return;
  if (!msg.embeds[0]) return;
  if (!msg.embeds[0].color) return;
  if (!msg.embeds[0].image?.url?.includes('bot-command-image-bump.png')) return;

  const settings = await getSettings(msg.guild);
  if (!settings) return;

  const channel = settings.channelid
    ? await ch.getChannel.guildTextChannel(settings.channelid)
    : msg.channel;
  if (!channel) return;

  ch.cache.disboardBumpReminders.delete(msg.guild.id);

  await msg.react(ch.stringEmotes.tick).catch(() => null);

  await ch.query(`UPDATE disboard SET nextbump = $1, tempchannelid = $2 WHERE guildid = $3;`, [
    msg.createdTimestamp + 7200000,
    String(channel.id),
    String(msg.guild.id),
  ]);

  if (settings.deletereply) {
    msg.delete().catch(() => null);
  }

  setReminder(msg, true, settings);
};

const getSettings = async (guild: Discord.Guild) =>
  ch
    .query('SELECT * FROM disboard WHERE guildid = $1 AND active = true;', [String(guild.id)])
    .then((r: DBT.disboard[] | null) => (r ? r[0] : null));

const setReminder = async (msg: CT.GuildMessage, isBump: boolean, settings: DBT.disboard) => {
  if (!isBump && !Number(settings.repeatreminder)) {
    ch.query(`UPDATE disboard SET nextbump = NULL WHERE guildid = $1;`, [String(msg.guild.id)]);
    return;
  }

  await doDelete(msg, settings);

  ch.query(`UPDATE disboard SET nextbump = $1 WHERE guildid = $2;`, [
    Date.now() + (isBump ? 7200000 : Number(settings.repeatreminder) * 60 * 1000),
    String(msg.guild.id),
  ]);

  ch.cache.disboardBumpReminders.set(
    jobs.scheduleJob(
      new Date(Date.now() + (isBump ? 7200000 : Number(settings.repeatreminder) * 60 * 1000)),
      () => {
        endReminder(msg);
      },
    ),
    msg.guild.id,
  );
};

export const endReminder = async (msg: CT.GuildMessage) => {
  const settings = await getSettings(msg.guild);
  if (!settings) return;

  let channel: Discord.Channel | undefined;
  if (settings.channelid) {
    channel = await ch.getChannel.guildTextChannel(settings.channelid);
  } else if (settings.tempchannelid) {
    channel = await ch.getChannel.guildTextChannel(settings.tempchannelid);
  } else return;
  if (!channel) return;

  const lan = msg.language.events.ready.disboard;

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.title,
      icon_url:
        'https://cdn.discordapp.com/avatars/302050872383242240/67342a774a9f2d20d62bfc8553bb98e0.png?size=4096',
      url: ch.constants.standard.invite,
    },
    description: lan.desc,
    color: ch.colorSelector(
      client.user ? await msg.guild.members.fetch(client.user.id) : undefined,
    ),
  };

  const users = settings.users?.map((u) => `<@${u}>`).join(', ') || '';
  const roles = settings.roles?.map((r) => `<@&${r}>`).join(', ') || '';

  const m = await ch.send(channel, { embeds: [embed], content: `${users}\n${roles}` });
  if (!m || Array.isArray(m)) return;

  await ch.query(`UPDATE disboard SET msgid = $1 WHERE guildid = $2;`, [
    String(m.id),
    String(msg.guild.id),
  ]);

  setReminder(msg, false, settings);
};

const doDelete = async (msg: CT.GuildMessage, settings: DBT.disboard) => {
  if (!settings.deletereply) return;
  if (!settings.msgid) return;
  if (!settings.tempchannelid) return;

  const channel = settings.channelid
    ? await ch.getChannel.guildTextChannel(settings.channelid)
    : await ch.getChannel.guildTextChannel(settings.tempchannelid);

  if (!channel) return;

  const message = await msg.channel.messages.fetch(settings.msgid).catch(() => null);
  if (!message) return;

  message.delete().catch(() => null);
};
