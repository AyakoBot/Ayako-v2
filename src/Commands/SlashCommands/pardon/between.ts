import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { log, pardon } from './one.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.pardon;

 const user = cmd.options.getUser('target', true);
 const rawDate1 = cmd.options.getString('date-1', true);
 const rawDate2 = cmd.options.getString('date-2', true);
 const reason = cmd.options.getString('reason', false) ?? language.noReasonProvided;

 if (ch.regexes.dateTester.test(rawDate1) || ch.regexes.dateTester.test(rawDate2)) {
  ch.errorCmd(cmd, language.errors.inputNoMatch, language);
  return;
 }

 try {
  new Date(rawDate1);
  new Date(rawDate2);
 } catch (e) {
  ch.errorCmd(cmd, (e as Error).message, language);
  return;
 }

 const date1 = new Date(rawDate1).getTime();
 const date2 = new Date(rawDate2).getTime();
 const punishments = await ch.getPunishment(date1, 'between', date2);

 if (!punishments) {
  ch.errorCmd(cmd, language.errors.punishmentNotFound, language);
  return;
 }

 punishments.forEach((p) => {
  pardon(p);
  log(cmd, p, language, lan, reason);
 });

 ch.replyCmd(cmd, {
  content: lan.pardonedMany(
   punishments.map((p) => `\`${Number(p.uniquetimestamp).toString(16)}\``).join(', '),
   user.id,
  ),
 });
};
