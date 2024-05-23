import * as Discord from 'discord.js';
import emote from './emote.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => emote(cmd, args, true);
