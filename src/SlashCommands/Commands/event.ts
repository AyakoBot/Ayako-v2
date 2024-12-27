import {
 ApplicationIntegrationType,
 InteractionContextType,
 SlashCommandBuilder,
 SlashCommandSubcommandBuilder,
 SlashCommandUserOption,
} from 'discord.js';

export default new SlashCommandBuilder()
 .setName('event')
 .setDescription('Seasonal and Event related Commands')
 .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
 .setIntegrationTypes([
  ApplicationIntegrationType.GuildInstall,
  ApplicationIntegrationType.UserInstall,
 ])
 .addSubcommand(
  new SlashCommandSubcommandBuilder().setName('collect').setDescription('Collect a snowball'),
 )
 .addSubcommand(
  new SlashCommandSubcommandBuilder()
   .setName('throw')
   .setDescription("Show em'!")
   .addUserOption(
    new SlashCommandUserOption().setName('user').setDescription('Aim and fire!').setRequired(true),
   ),
 )
 .addSubcommand(
  new SlashCommandSubcommandBuilder()
   .setName('leaderboard')
   .setDescription('Check the leaderboard'),
 );
