import type * as Discord from 'discord.js';

export default async (cmd: Discord.ModalSubmitInteraction<'cached'>, args: string[]) => {
 if (!cmd.isFromMessage()) return;
 if (!cmd.inCachedGuild()) return;

 const captcha = args.shift() as string;
 const value = cmd.fields.getTextInputValue('-');
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (value.toLowerCase() !== captcha?.toLowerCase()) {
  cmd.update({
   content: language.verification.wrongInput(captcha),
   embeds: [],
   files: [],
   components: [],
  });

  return;
 }

 const settings = await cmd.client.util.DataBase.verification.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) return;

 const pendingRole = settings.pendingrole ? cmd.guild.roles.cache.get(settings.pendingrole) : null;
 const verifiedRole = settings.finishedrole
  ? cmd.guild.roles.cache.get(settings.finishedrole)
  : null;

 if (pendingRole) {
  cmd.client.util.roleManager.remove(
   cmd.member,
   [pendingRole.id],
   language.verification.log.finished,
   1,
  );
 }

 if (verifiedRole) {
  cmd.client.util.roleManager.add(
   cmd.member,
   [verifiedRole.id],
   language.verification.log.finished,
   1,
  );
 }

 cmd.update({
  content: language.verification.finishDesc,
  embeds: [],
  components: [],
  files: [],
 });
};
