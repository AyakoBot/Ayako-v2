import * as Discord from 'discord.js';
import list from '../../SlashCommands/giveaway/list.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 list(cmd, Number(args[0]));
};
