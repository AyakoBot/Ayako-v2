import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const settings = await ch.DataBase.verification.findUnique({
  where: {
   guildid: cmd.guildId,
   active: true,
   OR: [{ finishedrole: { not: null } }, { pendingrole: { not: null } }],
  },
 });
 if (!settings) {
  ch.errorCmd(cmd, language.slashCommands.bypass.notEnabled, language);
  return;
 }

 const member = cmd.options.getMember('user');
 if (!member) {
  ch.errorCmd(cmd, language.t.errors.memberNotFound, language);
  return;
 }

 if (settings.pendingrole) {
  ch.roleManager.remove(member, [settings.pendingrole], language.autotypes.verification, 1);
 }

 if (settings.finishedrole) {
  ch.roleManager.add(member, [settings.finishedrole], language.autotypes.verification, 1);
 }

 ch.replyCmd(cmd, { content: language.slashCommands.bypass.success });
};
