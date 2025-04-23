import { AutoPunishPunishmentType, type votePunish } from '@prisma/client';
import type { GuildTextBasedChannel, Message, User } from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import redis from '../../../BaseClient/Bot/Redis.js';
import { ModTypes, type Language } from '../../../Typings/Typings.js';

type Payload = {
 id: number;
 guildId: string;
 channelId: string;
 msgId: string;
 options: string[];
 voters: { id: string; votes: string[] }[];
};

export default async (payload: Payload) => {
 const guild = client.guilds.cache.get(payload.guildId);
 if (!guild) return;

 const result = new Map<string, number>();
 payload.options.forEach((o) => result.set(o, 0));

 payload.voters.forEach((v) => {
  v.votes.forEach((vote) => {
   result.set(vote, result.get(vote)! + 1);
  });
 });

 const settings = await client.util.DataBase.votePunish.findUnique({
  where: { uniquetimestamp: payload.id, active: true },
 });
 if (!settings) return;

 const channel = guild.channels.cache.get(payload.channelId) as GuildTextBasedChannel;
 if (!channel) return;

 const message = await client.util.request.channels.getMessage(channel, payload.msgId);
 redis.expire(
  `${client.util.scheduleManager.prefix}:votePunish:expire:${payload.guildId}:${payload.channelId}`,
  1,
 );

 const punishUsers = await Promise.all(
  Object.entries(Object.fromEntries(result))
   .filter(([, v]) => v >= Number(settings.reqRoleAmount))
   .map(([k]) => client.util.getUser(k)),
 );

 const language = await client.util.getLanguage(payload.guildId);

 punishUsers
  .filter((u): u is User => !!u)
  .forEach((u) =>
   performPunishment(
    u,
    settings,
    language,
    payload,
    !message || 'message' in message ? undefined : message,
   ),
  );
};

const performPunishment = async (
 user: User,
 settings: votePunish,
 language: Language,
 payload: Payload,
 msg: Message<true> | undefined,
) => {
 const guild = client.guilds.cache.get(payload.guildId);
 if (!guild) return;

 const channel = guild.channels.cache.get(payload.channelId) as GuildTextBasedChannel;
 if (!channel) return;

 const baseOptions = {
  dbOnly: false,
  reason: language.autotypes.votepunish,
  executor: (await client.util.getBotMemberFromGuild(guild)).user,
  target: user,
  guild,
  skipChecks: false,
 };

 switch (settings.punishment) {
  case AutoPunishPunishmentType.ban:
   client.util.mod(msg, ModTypes.BanAdd, {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deleteMessageSeconds),
   });
   return;
  case AutoPunishPunishmentType.channelban:
   client.util.mod(msg, ModTypes.ChannelBanAdd, {
    ...baseOptions,
    channel: channel.isThread() ? (channel.parent as NonNullable<typeof channel.parent>) : channel,
   });
   return;
  case AutoPunishPunishmentType.kick:
   client.util.mod(msg, ModTypes.KickAdd, baseOptions);
   return;
  case AutoPunishPunishmentType.softban:
   client.util.mod(msg, ModTypes.SoftBanAdd, {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deleteMessageSeconds),
   });
   return;
  case AutoPunishPunishmentType.tempban:
   client.util.mod(msg, ModTypes.TempBanAdd, {
    ...baseOptions,
    deleteMessageSeconds: Number(settings.deleteMessageSeconds),
    duration: Number(settings.duration),
   });
   return;
  case AutoPunishPunishmentType.tempchannelban:
   client.util.mod(msg, ModTypes.TempChannelBanAdd, {
    ...baseOptions,
    channel: channel.isThread() ? (channel.parent as NonNullable<typeof channel.parent>) : channel,
    duration: Number(settings.duration),
   });
   return;
  case AutoPunishPunishmentType.tempmute:
   client.util.mod(msg, ModTypes.TempMuteAdd, {
    ...baseOptions,
    duration: Number(settings.duration),
   });
   return;
  case AutoPunishPunishmentType.warn:
   client.util.mod(msg, ModTypes.WarnAdd, baseOptions);
   return;
  default:
   throw new Error(`Invalid action: ${settings.punishment}`);
 }
};
