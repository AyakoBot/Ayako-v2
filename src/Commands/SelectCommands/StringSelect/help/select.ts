import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 const selected = cmd.values[0];
 ch.helperHelpers(cmd, selected as CT.CommandCategories);
};
