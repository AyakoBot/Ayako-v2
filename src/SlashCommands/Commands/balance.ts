import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('balance')
 .setDescription('Display your Balance')
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
 .addUserOption(
  new Discord.SlashCommandUserOption()
   .setName('user')
   .setDescription('The User')
   .setRequired(false),
 );
