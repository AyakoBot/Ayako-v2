import type * as Discord from 'discord.js';
import shoptype from './shoptype.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) =>
 shoptype(cmd, args, 'language');
