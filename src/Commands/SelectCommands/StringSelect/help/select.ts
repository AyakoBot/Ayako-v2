import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 const selected = cmd.values[0];
 ch.helpHelpers(cmd, selected as CT.CommandCategories);
};
