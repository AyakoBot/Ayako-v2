import * as Discord from 'discord.js';

export default (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.importCache.Commands.SlashCommands.mod['temp-channel-ban'].file.default(cmd);
