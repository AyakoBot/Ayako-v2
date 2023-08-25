import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 if (
  !cmd.member.roles.cache.has('1068238827644276847') &&
  !cmd.member.roles.cache.has('1077663004402925568')
 ) {
  cmd.reply({
   content: 'You need a higher level to enter!\nCheck <#1041356702227890196> for more info',
   ephemeral: true,
  });

  return;
 }

 const currentParticipants = await ch.DataBase.stats.findFirst({
  where: {},
  select: { willis: true },
 });

 if (currentParticipants?.willis?.includes(cmd.user.id)) {
  cmd.reply({
   content: 'You are already participating in this months giveaway',
   ephemeral: true,
  });

  return;
 }

 if (!currentParticipants?.willis) {
  ch.DataBase.stats.updateMany({ data: { willis: [cmd.user.id] } }).then();
 } else {
  ch.DataBase.stats
   .updateMany({ data: { willis: [...currentParticipants.willis, cmd.user.id] } })
   .then();
 }

 cmd.reply({
  content: 'You are now participating in this months giveaway',
  ephemeral: true,
 });
};
