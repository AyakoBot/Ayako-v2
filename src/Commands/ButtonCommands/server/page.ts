import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const page = args.shift() as string;
 const type = args.shift() as 'back' | 'forth';

 cmd.client.util.importCache.Commands.SlashCommands.server.list.file.default(
  cmd,
  [],
  type === 'back' ? Number(page) - 1 : Number(page) + 1,
 );
};
