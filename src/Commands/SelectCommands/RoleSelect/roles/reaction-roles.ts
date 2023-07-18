import * as Discord from 'discord.js';
import buttonRoles from './button-roles.js';

export default async (cmd: Discord.RoleSelectMenuInteraction, args: string[]) =>
 buttonRoles(cmd, args, 'reaction-roles');
