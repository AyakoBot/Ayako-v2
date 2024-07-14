import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('vote')
 .setDescription('Vote for Ayako on Top.gg!')
 .setContexts([
  Discord.InteractionContextType.BotDM,
  Discord.InteractionContextType.Guild,
  Discord.InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  Discord.ApplicationIntegrationType.GuildInstall,
  Discord.ApplicationIntegrationType.UserInstall,
 ]);
