import * as Discord from 'discord.js';
import servers from '../../SlashCommands/info/servers.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 servers(cmd, [], Number(args.shift()));
