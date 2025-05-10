import type { votePunish } from '@prisma/client';
import {
 ButtonStyle,
 ComponentType,
 PermissionFlagsBits,
 type GuildTextBasedChannel,
} from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async (payload: {
 id: number;
 guildId: string;
 userId: string;
 channelId: string;
}) => {
 if (!payload) return;

 const guild = client.guilds.cache.get(payload.guildId);
 if (!guild) return;

 const channel = guild.channels.cache.get(payload.channelId);
 if (!channel) return;
 if (!channel.isTextBased()) return;

 const mentioner = await client.util.getUser(payload.userId);
 if (!mentioner) return;

 const settings = await client.util.DataBase.votePunish.findUnique({
  where: { uniquetimestamp: payload.id, roleId: { not: null }, active: true },
 });
 if (!settings) return;

 const language = await client.util.getLanguage(guild.id);
 const lan = language.events.redis.votePunish;

 const m = await client.util.send(channel, {
  content: lan.content(
   guild.roles.cache.get(settings.roleId!),
   mentioner,
   client.util.constants.standard.getTime(Date.now() + 30000),
  ),
  components: [
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.UserSelect,
      custom_id: `votePunish_${payload.id}_${payload.userId}`,
      placeholder: lan.placeholder,
      max_values: 24,
      min_values: 1,
     },
    ],
   },
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.Button,
      style: ButtonStyle.Danger,
      custom_id: `votePunish/cancel_${settings.roleId}_${payload.userId}`,
      label: language.t.Cancel,
     },
    ],
   },
  ],
 });

 if (!m || 'message' in m) return;

 overwritePermissions(channel, settings, m.id);
};

const overwritePermissions = (
 channel: GuildTextBasedChannel,
 settings: votePunish,
 mId: string,
) => {
 const oldOverwrites = (
  channel.isThread() ? channel.parent : channel
 )!.permissionOverwrites.cache.map((o) => ({
  type: o.type,
  id: o.id,
  allow: o.allow,
  deny: o.deny,
 }));

 channel.client.util.scheduleManager.setScheduled(
  `votePunish:expire:${channel.guild.id}:${channel.id}`,
  JSON.stringify({
   overwrites: oldOverwrites.map((o) => ({
    ...o,
    deny: o.deny.bitfield.toString(),
    allow: o.allow.bitfield.toString(),
   })),
   guildId: channel.guild.id,
   id: mId,
   channelId: channel.id,
  }),
  30,
 );

 const overwritePerm = PermissionFlagsBits.SendMessages | PermissionFlagsBits.SendMessagesInThreads;

 client.util.request.channels.edit((channel.isThread() ? channel.parent : channel)!, {
  permission_overwrites: [
   ...oldOverwrites.map((o) => ({
    id: o.id,
    type: o.type,
    allow: String(
     (o.id === settings.roleId ? o.allow.add(overwritePerm) : o.allow.remove(overwritePerm))
      .bitfield,
    ),
    deny: String(
     (o.id === settings.roleId ? o.deny.remove(overwritePerm) : o.deny.add(overwritePerm)).bitfield,
    ),
   })),
  ],
 });
};
