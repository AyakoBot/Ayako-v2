import * as Discord from 'discord.js';
import disable from './disable.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => disable(cmd, args, true);
