import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('membercount')
 .setDescription('Display the Membercount of a Server')
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([
  Discord.ApplicationIntegrationType.GuildInstall,
  Discord.ApplicationIntegrationType.UserInstall,
 ]);
