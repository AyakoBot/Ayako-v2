import * as Discord from 'discord.js';
import list from '../../SlashCommands/server/list.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const page = args.shift() as string;
 const type = args.shift() as 'back' | 'forth';

 list(cmd, [], type === 'back' ? Number(page) - 1 : Number(page) + 1);
};
