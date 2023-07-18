import * as Discord from 'discord.js';
import del from '../button-roles/delete.js';

export default (cmd: Discord.ButtonInteraction, args: string[]) => del(cmd, args, 'reaction-roles');
