import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('afk')
 .setDescription('Set your AFK Status')
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('reason')
   .setDescription('The Reason for being AFK')
   .setRequired(false),
 );
