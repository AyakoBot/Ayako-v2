import * as Discord from 'discord.js';
import zero from '../user/zero.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => zero(cmd, args, 'role');
