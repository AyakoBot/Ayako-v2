import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 cmd.client.util.importCache.Commands.SlashCommands.giveaway.list.file.default(
  cmd,
  Number(args[0]),
 );
};
