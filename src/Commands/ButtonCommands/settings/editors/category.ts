import * as Discord from 'discord.js';
import channel from './channel.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 channel(cmd, args, 'category');
