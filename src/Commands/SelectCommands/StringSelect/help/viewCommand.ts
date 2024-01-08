import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 cmd.client.util.helpHelpers(cmd, args.shift() as CT.CommandCategories, cmd.values[0]);
};
