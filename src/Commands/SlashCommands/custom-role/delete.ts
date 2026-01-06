import type { ChatInputCommandInteraction } from 'discord.js';
import { getCustomRole, getSettings } from './create.js';

export default async (cmd: ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const settings = await getSettings(cmd);
 if (!settings) return;
 const { language, lan } = settings;

 const customRole = await getCustomRole(cmd, settings, false);
 if (!customRole) {
  cmd.client.util.errorCmd(
   cmd,
   lan.notExists((await cmd.client.util.getCustomCommand(cmd.guild, 'custom-role'))?.id || '0'),
   language,
  );
  return;
 }

 await cmd.client.util.request.guilds.deleteRole(cmd.guild, customRole.id, cmd.user.username);

 await cmd.client.util.DataBase.customroles.delete({
  where: { guildid_userid: { guildid: cmd.guildId, userid: cmd.user.id } },
 });

 cmd.client.util.replyCmd(cmd, { content: lan.deleted(customRole) });
};
