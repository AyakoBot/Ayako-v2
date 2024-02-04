import type * as Discord from 'discord.js';
import type * as CT from '../../../../SlashCommands/index.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 const selected = cmd.values[0];
 cmd.client.util.helpHelpers.default(cmd, selected as CT.CommandCategories);
};
