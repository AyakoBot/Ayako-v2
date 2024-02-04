import type * as Discord from 'discord.js';
import type * as CT from '../../../../SlashCommands/index.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 cmd.client.util.helpHelpers.default(cmd, args.shift() as CT.CommandCategories, cmd.values[0]);
};
