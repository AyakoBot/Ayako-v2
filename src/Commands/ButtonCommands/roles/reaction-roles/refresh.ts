import * as Discord from 'discord.js';
import refresh from '../button-roles/refresh.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 refresh(cmd, args, 'reaction-roles');
