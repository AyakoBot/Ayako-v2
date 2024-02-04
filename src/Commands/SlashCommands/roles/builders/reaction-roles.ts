import * as Discord from 'discord.js';

export default (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: [],
 reply?: Discord.InteractionResponse<true>,
) =>
 cmd.client.util.importCache.Commands.SlashCommands.roles.builders['button-roles'].file.default(
  cmd,
  [],
  reply,
  'reaction-roles',
 );
