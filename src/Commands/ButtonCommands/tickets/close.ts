import { TicketType, type DMTicket, type ticketing } from '@prisma/client';
import {
 ButtonStyle,
 CategoryChannel,
 ChannelType,
 ComponentType,
 Guild,
 MessageFlags,
 OverwriteType,
 type User,
 type APIActionRowComponent,
 type APIButtonComponentWithCustomId,
 type ButtonInteraction,
 type GuildTextBasedChannel,
 ThreadAutoArchiveDuration,
} from 'discord.js';
import type { Language, UsualMessagePayload } from 'src/Typings/Typings';

export default async (cmd: ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.channel) return;

 const id = args.pop() as string;
 if (!id) return;

 const language = await cmd.client.util.getLanguage(cmd.locale);

 if (cmd.channel?.name.startsWith(`${language.ticketing.closed}-`)) {
  cmd.reply({
   flags: MessageFlags.Ephemeral,
   embeds: [{ description: language.ticketing.ticketAlreadyClosed }],
  });
  return;
 }

 const settings = await cmd.client.util.DataBase.ticketing.findUnique({
  where: {
   uniquetimestamp: id,
   active: true,
   logChannelIds: { isEmpty: false },
  },
  include: { DMTicket: { where: { channelId: cmd.channel!.id } } },
 });

 const payload = await closeChannel(cmd.guild, language, cmd.channel, settings, cmd.user, id);
 cmd.reply(payload);
};

export const closeChannel = async (
 guild: Guild,
 language: Language,
 channel: GuildTextBasedChannel,
 settings: (ticketing & { DMTicket: DMTicket[] }) | null,
 closer: User,
 id: string,
): Promise<UsualMessagePayload> => {
 guild.client.util.request.channels.edit(channel!, {
  archived: channel.isThread() ? false : undefined,
  auto_archive_duration: channel.isThread() ? ThreadAutoArchiveDuration.OneHour : undefined,
  name:
   `${language.ticketing.closed}-${channel?.name.replace(language.ticketing.claimed, '')}`.slice(
    0,
    30,
   ),
  parent_id:
   !channel.isThread() &&
   settings &&
   [TicketType.Channel, TicketType.dmToChannel].includes(settings.type)
    ? settings.archiveCategoryId || undefined
    : undefined,
  permission_overwrites:
   !channel.isThread() &&
   settings &&
   [TicketType.Channel, TicketType.dmToChannel].includes(settings.type) &&
   !!settings.archiveCategoryId
    ? (
       guild.channels.cache.get(settings.archiveCategoryId) as CategoryChannel | undefined
      )?.permissionOverwrites.cache.map((o) => ({
       id: o.id,
       type: o.type,
       allow: String(o.allow.bitfield),
       deny: String(o.deny.bitfield),
      })) || undefined
    : undefined,
 });

 if (channel && !channel.isThread()) {
  channel.permissionOverwrites.cache
   .filter((o) => o.type === OverwriteType.Member)
   .forEach((o) => {
    guild.client.util.request.channels.deletePermissionOverwrite(
     channel!,
     o.id,
     language.autotypes.ticketing,
    );
   });
 }

 if (settings && channel) {
  guild.client.util.send(
   { id: settings.logChannelIds, guildId: guild.id },
   {
    embeds: [
     {
      author: { name: language.ticketing.logs.authorClose },
      description: language.ticketing.logs.descClose(closer, channel),
      color: guild.client.util.Colors.Loading,
     },
    ],
   },
  );
 }

 const deleteBtn: APIActionRowComponent<APIButtonComponentWithCustomId> = {
  type: ComponentType.ActionRow,
  components: [
   {
    type: ComponentType.Button,
    style: ButtonStyle.Danger,
    custom_id: `tickets/delete_${id}`,
    label: language.t.Delete,
   },
  ],
 };

 const payload: UsualMessagePayload = {
  embeds: [
   {
    author: { name: closer.username, icon_url: closer.displayAvatarURL() },
    description: closer.bot
     ? language.ticketing.hasClosedThreadInactive
     : settings
       ? language.ticketing.hasClosedThread
       : language.ticketing.hasClosed,
    color: guild.client.util.Colors.Danger,
   },
  ],
  components: [deleteBtn],
 };

 if (!settings) return payload;
 if (!settings.DMTicket[0]?.dmId) return payload;

 guild.client.util.request.channels.sendMessage(guild, settings.DMTicket[0]?.dmId, {
  embeds: [
   {
    author: { name: language.ticketing.SupportTeam },
    description: closer.bot
     ? language.ticketing.hasClosedThreadInactive
     : language.ticketing.hasClosedThread,
    color: guild.client.util.Colors.Danger,
   },
  ],
 });

 guild.client.util.DataBase.dMTicket.deleteMany({ where: { channelId: channel!.id } }).then();

 const pins = await guild.client.util.request.channels.getPins({
  skip: true,
  id: settings.DMTicket[0]?.dmId,
  name: '@me',
  guild: guild,
  type: ChannelType.DM,
  client: guild.client,
 });

 if ('message' in pins) return payload;

 const messages = pins.filter((m) => m.author.id === guild.client.user.id && m.components.length);
 messages.forEach((m) => {
  guild.client.util.request.channels.unpin(m, guild);
 });

 return payload;
};
