import { TicketType } from '@prisma/client';
import {
 BaseGuildTextChannel,
 ButtonStyle,
 CategoryChannel,
 ChannelType,
 ComponentType,
 MessageFlags,
 OverwriteType,
 type APIActionRowComponent,
 type APIButtonComponentWithCustomId,
 type ButtonInteraction,
} from 'discord.js';

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
 });

 cmd.client.util.request.channels.edit(cmd.channel!, {
  name:
   `${language.ticketing.closed}-${cmd.channel?.name.replace(language.ticketing.claimed, '')}`.slice(
    0,
    30,
   ),
  parent_id:
   !cmd.channel.isThread() &&
   settings &&
   [TicketType.Channel, TicketType.dmToChannel].includes(settings.type)
    ? settings.archiveCategoryId || undefined
    : undefined,
  permission_overwrites:
   !cmd.channel.isThread() &&
   settings &&
   [TicketType.Channel, TicketType.dmToChannel].includes(settings.type) &&
   !!settings.archiveCategoryId
    ? (
       cmd.guild.channels.cache.get(settings.archiveCategoryId) as CategoryChannel | undefined
      )?.permissionOverwrites.cache.map((o) => ({
       id: o.id,
       type: o.type,
       allow: String(o.allow.bitfield),
       deny: String(o.deny.bitfield),
      })) || undefined
    : undefined,
 });

 if (cmd.channel && !cmd.channel.isThread()) {
  (cmd.channel as BaseGuildTextChannel).permissionOverwrites.cache
   .filter((o) => o.type === OverwriteType.Member)
   .forEach((o) => {
    cmd.client.util.request.channels.deletePermissionOverwrite(
     cmd.channel!,
     o.id,
     language.autotypes.ticketing,
    );
   });
 }

 if (settings && cmd.channel) {
  cmd.client.util.send(
   { id: settings.logChannelIds, guildId: cmd.guildId },
   {
    embeds: [
     {
      author: { name: language.ticketing.logs.authorClose },
      description: language.ticketing.logs.descClose(cmd.user, cmd.channel),
      color: cmd.client.util.Colors.Loading,
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

 const dmThread = await cmd.client.util.DataBase.dMTicket.findFirst({
  where: { channelId: cmd.channel!.id },
 });
 if (!dmThread) {
  cmd.reply({
   embeds: [
    {
     author: { name: cmd.user.username, icon_url: cmd.user.displayAvatarURL() },
     description: language.ticketing.hasClosed,
     color: cmd.client.util.Colors.Danger,
    },
   ],
   components: [deleteBtn],
  });
  return;
 }

 cmd.reply({
  embeds: [
   {
    author: { name: cmd.user.username, icon_url: cmd.user.displayAvatarURL() },
    description: language.ticketing.hasClosedThread,
    color: cmd.client.util.Colors.Danger,
   },
  ],
  components: [deleteBtn],
 });

 cmd.client.util.request.channels.sendMessage(cmd.guild, dmThread.dmId, {
  embeds: [
   {
    author: { name: language.ticketing.SupportTeam },
    description: language.ticketing.hasClosedThread,
    color: cmd.client.util.Colors.Danger,
   },
  ],
 });

 cmd.client.util.DataBase.dMTicket.deleteMany({ where: { channelId: cmd.channel!.id } }).then();

 const pins = await cmd.client.util.request.channels.getPins({
  skip: true,
  id: dmThread.dmId,
  name: '@me',
  guild: cmd.guild,
  type: ChannelType.DM,
  client: cmd.client,
 });

 if ('message' in pins) return;

 const messages = pins.filter((m) => m.author.id === cmd.client.user.id && m.components.length);
 messages.forEach((m) => {
  cmd.client.util.request.channels.unpin(m, cmd.guild);
 });
};
