import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const member = await cmd.guild?.members.fetch(cmd.user.id).catch(() => undefined);
 if (!member) return;

 if (
  !member.roles.cache.has('1068238827644276847') &&
  !member.roles.cache.has('1077663004402925568')
 ) {
  cmd.reply({
   content: 'You need a higher level to enter!\nCheck <#1041356702227890196> for more info',
   ephemeral: true,
  });

  return;
 }

 const currentParticipants = await ch
  .query(`SELECT willis FROM stats;`)
  .then((r: DBT.stats[] | null) => (r ? r[0] : null));

 if (currentParticipants?.willis?.includes(cmd.user.id)) {
  cmd.reply({
   content: 'You are already participating in this months giveaway',
   ephemeral: true,
  });

  return;
 }

 if (!currentParticipants?.willis) {
  ch.query(`UPDATE stats SET willis = $1;`, [[cmd.user.id]]);
 } else {
  ch.query(`UPDATE stats SET willis = $1;`, [[cmd.user.id, ...currentParticipants.willis]]);
 }

 cmd.reply({
  content: 'You are now participating in this months giveaway',
  ephemeral: true,
 });
};
