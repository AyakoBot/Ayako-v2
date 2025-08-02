import { TicketType } from '@prisma/client';
import {
 ButtonStyle,
 ChannelType,
 ComponentType,
 MessageFlags,
 OverwriteType,
 PermissionFlagsBits,
 type ChatInputCommandInteraction,
 type GuildTextBasedChannel,
} from 'discord.js';
import { getPayload } from '../../SlashCommands/info/user.js';

export default async (cmd: ChatInputCommandInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.locale);

 const settings = await cmd.client.util.DataBase.ticketing.findUnique({
  where: { uniquetimestamp: args.pop() || '' },
  include: { DMTicket: { where: { userId: cmd.user.id } } },
 });
 if (!settings || !settings.active) {
  cmd.client.util.errorCmd(cmd, language.ticketing.notActive, language);
  return;
 }

 if (
  settings.bluserid.includes(cmd.user.id) ||
  settings.blroleid.some((r) => cmd.member?.roles.cache.has(r))
 ) {
  cmd.client.util.errorCmd(cmd, language.ticketing.blocked, language);
  return;
 }

 if (settings.DMTicket.length) {
  cmd.client.util.errorCmd(cmd, language.ticketing.alreadyInTicket, language);
  return;
 }

 let dmId: string | undefined = undefined;

 if ([TicketType.dmToThread, TicketType.dmToChannel].includes(settings.type)) {
  if (
   (!settings.channelId && settings.type === TicketType.dmToThread) ||
   (!settings.categoryId && settings.type === TicketType.dmToChannel)
  ) {
   cmd.client.util.errorCmd(cmd, language.ticketing.notActive, language);
   return;
  }

  const dm = await cmd.client.util.request.users.createDM(cmd.guild, cmd.user.id, cmd.client);
  const msg =
   dm && !('message' in dm)
    ? await cmd.client.util.request.channels.sendMessage(cmd.guild, dm.id, {
       content: language.ticketing.startChatting,
       components: [
        {
         type: ComponentType.ActionRow,
         components: [
          {
           type: ComponentType.Button,
           custom_id: `tickets/leave_${settings.uniquetimestamp}`,
           label: language.ticketing.leaveTicket,
           style: ButtonStyle.Danger,
          },
         ],
        },
       ],
      })
    : undefined;

  if (!msg || 'message' in dm || 'message' in msg) {
   cmd.client.util.errorCmd(cmd, language.ticketing.openDMs, language);
   return;
  }

  cmd.client.util.request.channels.pin(msg, cmd.guild);

  cmd.reply({
   flags: MessageFlags.Ephemeral,
   content: `${language.ticketing.dmd} => ${msg.url}`,
  });

  dmId = dm.id;
 }

 const supportChannel = [TicketType.dmToThread, TicketType.Thread].includes(settings.type)
  ? await cmd.client.util.request.channels.createThread(
     cmd.guild.channels.cache.get(settings.channelId!) as GuildTextBasedChannel,
     {
      name: cmd.user.username,
      type: ChannelType.PrivateThread,
      auto_archive_duration: Number(settings.archiveDuration),
     },
    )
  : await cmd.client.util.request.guilds.createChannel(cmd.guild, {
     name: cmd.user.username,
     type: ChannelType.GuildText,
     parent_id: settings.categoryId,
    });

 if ('message' in supportChannel) {
  cmd.client.util.errorCmd(cmd, language.ticketing.cantCreateChannel, language);
  return;
 }

 if (settings.type === TicketType.Channel) {
  cmd.client.util.request.channels.editPermissionOverwrite(
   supportChannel as GuildTextBasedChannel,
   cmd.user.id,
   {
    type: OverwriteType.Member,
    allow: String(
     PermissionFlagsBits.ViewChannel |
      PermissionFlagsBits.SendMessages |
      PermissionFlagsBits.AttachFiles |
      PermissionFlagsBits.EmbedLinks,
    ),
   },
   language.autotypes.ticketing,
  );
 }

 const initPayload = await getPayload(cmd.user, language, cmd.guild);

 const msg = await cmd.client.util.send(supportChannel, {
  content: `${
   [TicketType.Channel, TicketType.Thread].includes(settings.type) ? cmd.user : ''
  }\n${settings.mentionRoles.map((r) => `<@&${r}>`).join(' ')}\n${settings.mentionUsers
   .map((u) => `<@${u}>`)
   .join(' ')}`,
  embeds: [initPayload.embeds[0]],
  components: [
  {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.Button,
      custom_id: `info/user_${cmd.user.id}`,
      label: language.ticketing.closeTicket,
      style: ButtonStyle.Danger,
     },
    ],
   },
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.Button,
      custom_id: `tickets/close_${settings.uniquetimestamp}`,
      label: language.ticketing.closeTicket,
      style: ButtonStyle.Danger,
     },

     {
      type: ComponentType.Button,
      custom_id: `tickets/claim_${settings.uniquetimestamp}_${cmd.user.id}`,
      label: language.ticketing.claimTicket,
      style: ButtonStyle.Success,
     },
    ],
   },
  ],
 });

 if (!msg || 'message' in msg) {
  cmd.client.util.errorCmd(cmd, language.ticketing.cantCreateChannel, language);
  cmd.client.util.request.channels.delete(supportChannel as GuildTextBasedChannel);
  cmd.client.util.DataBase.dMTicket.delete({ where: { userId: cmd.user.id } }).then();
  return;
 }

 if ([TicketType.Channel, TicketType.Thread].includes(settings.type)) {
  cmd.reply({
   flags: MessageFlags.Ephemeral,
   content: `${language.ticketing.ticketed} => ${msg.url}`,
  });
 }

 cmd.client.util.send(
  { id: settings.logChannelIds, guildId: cmd.guildId },
  {
   embeds: [
    {
     author: { name: language.ticketing.logs.authorCreate },
     description: language.ticketing.logs.descCreate(
      cmd.user,
      supportChannel as GuildTextBasedChannel,
     ),
     color: cmd.client.util.Colors.Success,
    },
   ],
  },
 );

 if (!dmId) return;

 cmd.client.util.DataBase.dMTicket
  .create({
   data: {
    dmId,
    userId: cmd.user.id,
    channelId: supportChannel.id,
    settingsId: settings.uniquetimestamp,
   },
  })
  .then();
};
