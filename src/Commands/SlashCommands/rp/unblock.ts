import * as Discord from 'discord.js';

export default (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.importCache.Commands.ButtonCommands.rp.unblock.file.default(cmd);
