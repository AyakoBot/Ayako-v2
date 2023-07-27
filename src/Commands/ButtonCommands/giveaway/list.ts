import * as Discord from 'discord.js';
import list from '../../SlashCommands/giveaway/list.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 list(cmd, Number(args[0]));
};
