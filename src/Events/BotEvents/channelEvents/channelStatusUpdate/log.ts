import type { APIEmbed, AuditLogEvent, BaseGuildVoiceChannel } from 'discord.js';
import { Colors, type AcceptedMergingTypes } from '../../../../Typings/Typings.js';

export default async (channel: BaseGuildVoiceChannel, oldStatus: string, newStatus: string) => {
 const channels = await channel.client.util.getLogChannels('channelevents', channel.guild);
 if (!channels) return;

 const language = await channel.client.util.getLanguage(channel.guild.id);
 const lan = language.events.logs.channel;
 const con = channel.client.util.constants.events.logs.channel;

 const audit = await channel.client.util.request.guilds.getAuditLogs(channel.guild, {
  action_type: (newStatus.length ? 192 : 193) as AuditLogEvent,
  limit: 50,
 });

 const relevantAudit =
  'message' in audit
   ? undefined
   : audit.entries
      .filter((e) =>
       e.targetId === channel.id && e.action === (192 as AuditLogEvent)
        ? (e.extra as { status: string } | null)?.status === newStatus
        : true,
      )
      .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
      .first();

 const getTitle = () => {
  if (!newStatus.length) return lan.nameStatusDelete;
  if (!oldStatus.length) return lan.nameStatusCreate;
  return lan.nameStatusUpdate;
 };

 const getColor = () => {
  if (!newStatus.length) return Colors.Danger;
  if (!oldStatus.length) return Colors.Success;
  return Colors.Loading;
 };

 const getType = (): 'Delete' | 'Create' | 'Update' => {
  if (!newStatus.length) return 'Delete';
  if (!oldStatus.length) return 'Create';
  return 'Update';
 };

 const embed: APIEmbed = {
  author: {
   icon_url: con[`${channel.client.util.getTrueChannelType(channel, channel.guild)}${getType()}`],
   name: getTitle(),
  },
  description:
   relevantAudit && relevantAudit.executor
    ? lan.descStatusUpdateAudit(
       relevantAudit.executor,
       channel,
       language.channelTypes[channel.type],
      )
    : lan.descStatusUpdate(channel, language.channelTypes[channel.type]),
  fields: [],
  color: getColor(),
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: AcceptedMergingTypes, name: string) =>
  channel.client.util.mergeLogging(before, after, type, embed, language, name);

 if (oldStatus !== newStatus) {
  merge(oldStatus || language.t.None, newStatus || language.t.None, 'string', lan.channelStatus);
 }

 if (!embed.fields?.length) return;

 channel.client.util.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] }, 10000);
};
