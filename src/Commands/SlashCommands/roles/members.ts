import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const role = cmd.options.getRole('role', true);

 await cmd.client.util.importCache.Commands.ButtonCommands.info.members.file.default(cmd, [
  role.id,
 ]);
};
