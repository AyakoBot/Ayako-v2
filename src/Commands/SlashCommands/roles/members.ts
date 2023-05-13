import * as Discord from 'discord.js';
import members from '../../ButtonCommands/info/members.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const role = cmd.options.getRole('role', true);

 await members(cmd, [role.id]);
};
