import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ModalSubmitInteraction<'cached'>, args: string[]) => {
 if (!cmd.isFromMessage()) return;
 if (!cmd.inCachedGuild()) return;

 const captcha = args.shift() as string;
 const value = cmd.fields.getTextInputValue('-');
 const language = await ch.getLanguage(cmd.guildId);

 if (value.toLowerCase() !== captcha?.toLowerCase()) {
  cmd.update({
   content: language.verification.wrongInput(captcha),
   embeds: [],
   files: [],
   components: [],
  });

  return;
 }

 const settings = await ch.DataBase.verification.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) return;

 const pendingRole = settings.pendingrole ? cmd.guild?.roles.cache.get(settings.pendingrole) : null;
 const verifiedRole = settings.finishedrole
  ? cmd.guild?.roles.cache.get(settings.finishedrole)
  : null;

 if (pendingRole) {
  ch.roleManager.remove(cmd.member, [pendingRole.id], language.verification.log.finished, 1);
 }

 if (verifiedRole) {
  ch.roleManager.add(cmd.member, [verifiedRole.id], language.verification.log.finished, 1);
 }

 cmd.update({
  content: language.verification.finishDesc,
  embeds: [],
  components: [],
  files: [],
 });
};
