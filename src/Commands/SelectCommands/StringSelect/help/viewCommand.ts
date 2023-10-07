import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 ch.helpHelpers(cmd, args.shift() as CT.CommandCategories, cmd.values[0]);
};
