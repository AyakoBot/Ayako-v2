import * as Discord from 'discord.js';
import selfRoles from '../../../SlashCommands/self-roles.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 if (!cmd.inCachedGuild()) return;

 selfRoles(cmd, cmd.values);
};
