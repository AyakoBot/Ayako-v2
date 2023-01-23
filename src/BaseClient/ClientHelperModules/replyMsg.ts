import type * as Discord from 'discord.js';
import jobs, { scheduleJob } from 'node-schedule';
import query from './query.js';
import type CT from '../../Typings/CustomTypings';
import type DBT from '../../Typings/DataBaseTypings';
import objectEmotes from '../Other/ObjectEmotes.json' assert { type: 'json' };

export default async (
  msg: Discord.Message | CT.GuildMessage | CT.Message,
  payload: Discord.MessageCreateOptions,
  command?: CT.Command,
) => {
  if (!msg) return undefined;

  const sentMessage = await msg.reply(payload).catch((err) => {
    // eslint-disable-next-line no-console
    console.log('msg reply err', err);
  });

  if (!sentMessage) return undefined;

  if (msg.guild && command) {
    cooldownHandler(msg as CT.GuildMessage, sentMessage, command);
    deleteCommandHandler(msg as CT.GuildMessage, sentMessage, command);
  }

  return sentMessage;
};

export const cooldownHandler = async (
  msg: CT.GuildMessage | CT.GuildInteraction,
  sentMessage: Discord.Message | Discord.InteractionResponse,
  command: CT.Command,
) => {
  if (!command.cooldown) return;

  const authorId = 'author' in msg ? msg.author.id : msg.user.id;

  const r = await getCooldownRow(msg.guild, command);
  if (!r) return;
  if (!authorId) return;
  if (r.bpuserid?.includes(String(authorId))) return;
  if (msg.channel && r.bpchannelid?.includes(msg.channel.id)) return;

  if (msg.member) {
    const { roles } = msg.member;
    if (Array.isArray(roles) && r.bproleid?.some((id) => roles.includes(id))) return;
    if ('cache' in roles && r.bproleid?.some((id) => roles.cache.has(id))) return;
  }
  if (r.activechannelid?.length && !r.activechannelid?.includes(String(msg.channelId))) return;

  let emote: string;

  if (Number(r.cooldown) <= 60000) {
    const emoteToUse = objectEmotes.timers[Number(r.cooldown) / 1000];
    emote = `${emoteToUse.name}:${emoteToUse.id}`;
  } else emote = '⌛';

  if (!('react' in sentMessage)) return;

  const reaction = await sentMessage.react(emote).catch(() => null);
  if (reaction === null) return;
  const reactions = [emote];

  if (emote === '⌛') {
    const emoteToUse = objectEmotes.timers[60];
    emote = `${emoteToUse.name}:${emoteToUse.id}`;

    jobs.scheduleJob(new Date(Date.now() + (Number(r.cooldown) - 60000)), async () => {
      const secondReaction = await sentMessage.react(emote).catch(() => null);
      if (secondReaction === null) return;

      reactions.push(emote);
    });
  }

  jobs.scheduleJob(new Date(Date.now() + Number(r.cooldown)), async () => {
    const client = (await import('../Client.js')).default;

    reactions.forEach((react) => {
      sentMessage.reactions.cache
        .get(react)
        ?.users.remove(client.user?.id)
        .catch(() => null);
    });
  });
};

export const deleteCommandHandler = async (
  msg: CT.GuildMessage | CT.GuildInteraction,
  sentMessage: Discord.Message | Discord.InteractionResponse,
  command: CT.Command,
) => {
  const settings = await getDeleteSettings(msg.guild, command.name);
  if (!settings) return;

  const applyingSettings = settings
    .map((s) => {
      if (s.wlchannelid.includes(String(msg.channelId))) return null;
      if (s.activechannelid.includes(String(msg.channelId))) return s;
      if (!s.activechannelid?.length) return s;

      return null;
    })
    .filter((s): s is DBT.deletecommands => !!s);
  if (!applyingSettings.length) return;

  const s = applyingSettings.sort((a, b) => Number(b.deletetimeout) - Number(a.deletetimeout))[0];
  if (!s.deletetimeout) return;

  scheduleJob(Date.now() + Number(s.deletetimeout), () => {
    if (s.deletereply && 'delete' in sentMessage) sentMessage.delete().catch(() => null);
    if (s.deletecommand && msg.channelId && 'delete' in msg) msg.delete().catch(() => null);
  });
};

const getDeleteSettings = async (guild: Discord.Guild, commandName: string) =>
  query(`SELECT * FROM deletecommands WHERE active = true AND guildid = $1 AND command = $2;`, [
    String(guild.id),
    commandName,
  ]).then((r: DBT.deletecommands[] | null) => r);

const getCooldownRow = (guild: Discord.Guild, command: CT.Command) =>
  query(
    `SELECT * FROM cooldowns WHERE guildid = $1 AND active = true AND command = $2 and cooldown = $3;`,
    [String(guild.id), command.name, command.cooldown],
  ).then((r: DBT.cooldowns[] | null) => (r ? r[0] : null));
