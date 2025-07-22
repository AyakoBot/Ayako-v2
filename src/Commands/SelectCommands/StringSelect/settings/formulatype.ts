import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import shoptype from './shoptype.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) =>
 shoptype(cmd, args, CT.EditorTypes.FormulaType);
