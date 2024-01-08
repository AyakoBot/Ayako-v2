import * as Discord from 'discord.js';
import { log, pardon } from './one.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.pardon;

 const user = cmd.options.getUser('target', true);
 const reason = cmd.options.getString('reason', false) ?? language.t.noReasonProvided;

 const punishments = await cmd.client.util.getPunishment(user.id, {
  identType: 'all-on',
  guildid: cmd.guild.id,
 });

 if (!punishments) {
  cmd.client.util.errorCmd(cmd, language.errors.punishmentNotFound, language);
  return;
 }

 punishments.forEach((p) => {
  pardon(p);
  log(cmd, p, language, lan, reason);
 });

 cmd.client.util.replyCmd(cmd, {
  content: lan.pardonedMany(
   punishments.map((p) => `\`${Number(p.uniquetimestamp).toString(36)}\``).join(', '),
   user.id,
  ),
 });
};
