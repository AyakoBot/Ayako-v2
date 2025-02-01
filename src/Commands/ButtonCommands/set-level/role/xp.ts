import * as Discord from 'discord.js';
import lvl from './lvl.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 lvl(cmd, args, 'xp', 'role');
