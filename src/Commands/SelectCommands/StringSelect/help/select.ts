import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 const selected = cmd.values[0];
 cmd.client.util.helpHelpers(cmd, selected as CT.CommandCategories);
};
