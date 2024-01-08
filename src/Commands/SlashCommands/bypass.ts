import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const settings = await cmd.client.util.DataBase.verification.findUnique({
  where: {
   guildid: cmd.guildId,
   active: true,
   OR: [{ finishedrole: { not: null } }, { pendingrole: { not: null } }],
  },
 });
 if (!settings) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.bypass.notEnabled, language);
  return;
 }

 const member = cmd.options.getMember('user');
 if (!member) {
  cmd.client.util.errorCmd(cmd, language.errors.memberNotFound, language);
  return;
 }

 if (settings.pendingrole) {
  cmd.client.util.roleManager.remove(
   member,
   [settings.pendingrole],
   language.autotypes.verification,
   1,
  );
 }

 if (settings.finishedrole) {
  cmd.client.util.roleManager.add(
   member,
   [settings.finishedrole],
   language.autotypes.verification,
   1,
  );
 }

 cmd.client.util.replyCmd(cmd, { content: language.slashCommands.bypass.success });
};
