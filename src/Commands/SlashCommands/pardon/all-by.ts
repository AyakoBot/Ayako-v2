import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { log, pardon } from './one.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.pardon;

 const executor = cmd.options.getUser('executor', true);
 const reason = cmd.options.getString('reason', false) ?? language.noReasonProvided;

 const punishments = await ch.getPunishment(executor.id, 'all-by');

 if (!punishments) {
  ch.errorCmd(cmd, language.errors.punishmentNotFound, language);
  return;
 }

 punishments.forEach((p) => {
  pardon(p);
  log(cmd, p, language, lan, reason);
 });

 ch.replyCmd(cmd, {
  content: lan.pardonedManyBy(
   punishments.map((p) => `\`${Number(p.uniquetimestamp).toString(36)}\``).join(', '),
   executor.id,
  ),
 });
};
