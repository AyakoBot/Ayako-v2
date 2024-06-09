import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { getGiveawayEmbed } from '../../SlashCommands/giveaway/end.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const giveaway = await cmd.client.util.DataBase.giveaways.findUnique({
  where: { msgid: cmd.message.id, ended: false },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.participate;

 if (!giveaway) {
  cmd.client.util.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const member = cmd.guild?.members.cache.get(cmd.user.id);
 if (!member) {
  cmd.client.util.error(cmd.guild, new Error('Cannot find member'));
  return;
 }

 switch (true) {
  case giveaway.participants?.includes(cmd.user.id): {
   cmd.client.util.replyCmd(cmd, { content: lan.left });

   giveaway.participants = giveaway.participants?.filter((p) => p !== cmd.user.id) ?? [];
   break;
  }
  case !giveaway.participants?.includes(cmd.user.id): {
   cmd.client.util.replyCmd(cmd, {
    content:
     giveaway.reqrole && !cmd.member.roles.cache.has(giveaway.reqrole)
      ? lan.reqNotMet
      : lan.entered,
   });

   if (!giveaway.participants) giveaway.participants = [cmd.user.id];
   else giveaway.participants.push(cmd.user.id);
   break;
  }
  default: {
   cmd.client.util.errorCmd(cmd, language.t.Unknown, language);
   return;
  }
 }

 const newGiveaway = await cmd.client.util.DataBase.giveaways.update({
  where: { msgid: cmd.message.id },
  data: { participants: giveaway.participants },
 });

 if (!newGiveaway) {
  cmd.client.util.error(cmd.guild, new Error('No Giveaway Data returned'));
  return;
 }

 edit(cmd, language, newGiveaway);
};

const edit = async (
 cmd: Discord.ButtonInteraction<'cached'>,
 language: CT.Language,
 giveaway: Prisma.giveaways,
) => {
 const channel = await cmd.client.util.getChannel.guildTextChannel(cmd.channelId);
 if (!channel) {
  cmd.client.util.error(cmd.guild as Discord.Guild, new Error('Cannot find channel'));
  return;
 }

 const msg = await cmd.client.util.request.channels.getMessage(channel, cmd.message.id);
 if ('message' in msg) {
  cmd.client.util.error(cmd.guild as Discord.Guild, msg);
  return;
 }

 if (!(await cmd.client.util.isEditable(msg))) {
  cmd.client.util.error(cmd.guild as Discord.Guild, new Error('Cannot edit Message'));
  return;
 }

 if (
  !msg.flags.has(Discord.MessageFlags.Crossposted) ||
  msg.channel.type !== Discord.ChannelType.GuildAnnouncement
 ) {
  cmd.client.util.request.channels.editMsg(msg, {
   embeds: [await getGiveawayEmbed(language, giveaway)],
  });
  return;
 }

 if (Number(msg.editedTimestamp) > Date.now() - 1800000) return;
 cmd.client.util.request.channels.editMsg(msg, {
  embeds: [await getGiveawayEmbed(language, giveaway)],
 });
};
