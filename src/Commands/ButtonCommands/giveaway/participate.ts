import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import { getGiveawayEmbed } from '../../SlashCommands/giveaway/end.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const giveaway = await ch.DataBase.giveaways.findUnique({
  where: { msgid: cmd.message.id, ended: false },
 });

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.giveaway.participate;

 if (!giveaway) {
  ch.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const member = cmd.guild?.members.cache.get(cmd.user.id);
 if (!member) {
  ch.error(cmd.guild, new Error('Cannot find member'));
  return;
 }

 if (giveaway.reqrole && !member.roles?.cache.has(giveaway.reqrole)) {
  ch.errorCmd(cmd, lan.cantEnter, language);
  return;
 }

 switch (true) {
  case giveaway.participants?.includes(cmd.user.id): {
   ch.replyCmd(cmd, { content: lan.left });

   giveaway.participants = giveaway.participants?.filter((p) => p !== cmd.user.id) ?? [];
   break;
  }
  case !giveaway.participants?.includes(cmd.user.id): {
   ch.replyCmd(cmd, { content: lan.entered });

   if (!giveaway.participants) giveaway.participants = [cmd.user.id];
   else giveaway.participants.push(cmd.user.id);
   break;
  }
  default: {
   ch.errorCmd(cmd, language.Unknown, language);
   return;
  }
 }

 const newGiveaway = await ch.DataBase.giveaways.update({
  where: { msgid: cmd.message.id },
  data: { participants: giveaway.participants },
 });

 if (!newGiveaway) {
  ch.error(cmd.guild, new Error('No Giveaway Data returned'));
  return;
 }

 edit(cmd, language, newGiveaway);
};

const edit = async (
 cmd: Discord.ButtonInteraction,
 language: CT.Language,
 giveaway: Prisma.giveaways,
) => {
 const msg = await cmd.message.fetch().catch((err) => err as Discord.DiscordAPIError);
 if ('message' in msg) {
  ch.error(cmd.guild as Discord.Guild, msg);
  return;
 }

 if (!msg.editable) {
  ch.error(cmd.guild as Discord.Guild, new Error('Cannot edit Message'));
  return;
 }

 if (
  !msg.flags.has(Discord.MessageFlags.Crossposted) ||
  msg.channel.type !== Discord.ChannelType.GuildAnnouncement
 ) {
  msg.edit({ embeds: [await getGiveawayEmbed(language, giveaway)] });
  return;
 }

 if (Number(msg.editedTimestamp) > Date.now() - 1800000) return;
 msg.edit({ embeds: [await getGiveawayEmbed(language, giveaway)] });
};
