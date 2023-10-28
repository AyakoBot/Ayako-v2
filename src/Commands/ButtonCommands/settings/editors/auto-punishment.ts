import * as Discord from 'discord.js';
import shoptype from './shoptype.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 shoptype(cmd, args, 'auto-punishment');
