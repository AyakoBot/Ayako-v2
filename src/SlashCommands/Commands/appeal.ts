import {
 ApplicationIntegrationType,
 InteractionContextType,
 SlashCommandBuilder,
 SlashCommandStringOption,
} from 'discord.js';

export default new SlashCommandBuilder()
 .setName('appeal')
 .setDescription('Appeal a Punishment')
 .setContexts([
  InteractionContextType.BotDM,
  InteractionContextType.PrivateChannel,
  InteractionContextType.Guild,
 ])
 .setIntegrationTypes([
  ApplicationIntegrationType.UserInstall,
  ApplicationIntegrationType.GuildInstall,
 ])
 .addStringOption(
  new SlashCommandStringOption()
   .setName('server')
   .setDescription('The server to show punishments from')
   .setAutocomplete(true)
   .setRequired(true)
   .setMaxLength(19)
   .setMinLength(17),
 )
 .addStringOption(
  new SlashCommandStringOption()
   .setName('punishment')
   .setDescription('The Punishment to appeal')
   .setMaxLength(8)
   .setMinLength(8)
   .setRequired(true)
   .setAutocomplete(true),
 );
