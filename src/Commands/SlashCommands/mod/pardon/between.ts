import * as Discord from 'discord.js';
import { log, pardon } from './one.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.pardon;

 const user = cmd.options.getUser('target', true);
 const rawDate1 = cmd.options.getString('date-1', true);
 const rawDate2 = cmd.options.getString('date-2', true);
 const reason = cmd.options.getString('reason', false) ?? language.t.noReasonProvided;

 if (
  !rawDate1.match(cmd.client.util.regexes.dateTester)?.length ||
  !rawDate2.match(cmd.client.util.regexes.dateTester)?.length
 ) {
  cmd.client.util.errorCmd(cmd, language.errors.inputNoMatch, language);
  return;
 }

 try {
  new Date(rawDate1);
  new Date(rawDate2);
 } catch (e) {
  cmd.client.util.errorCmd(cmd, e as Error, language);
  return;
 }

 const date1 = new Date(rawDate1).getTime();
 const date2 = new Date(rawDate2).getTime();
 const punishments = await cmd.client.util.getPunishment(date1, {
  identType: 'between',
  ident: date2,
  guildid: cmd.guild.id,
 });

 if (!punishments) {
  cmd.client.util.errorCmd(cmd, language.errors.punishmentNotFound, language);
  return;
 }

 punishments.forEach((p) => {
  pardon(p).then();
  log(cmd, p, language, lan, reason);
 });

 cmd.client.util.replyCmd(cmd, {
  content: lan.pardonedMany(
   punishments.map((p) => `\`${Number(p.uniquetimestamp).toString(36)}\``).join(', '),
   user.id,
  ),
 });
};
