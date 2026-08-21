import * as Discord from 'discord.js';

export default (cmd: Discord.ChatInputCommandInteraction<'cached'>) =>
 cmd.client.util.interactionHelpers(cmd);
