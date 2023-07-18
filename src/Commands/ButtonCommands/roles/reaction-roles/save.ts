import * as Discord from 'discord.js';
import save from '../button-roles/save.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 save(cmd, args, 'reaction-roles');
