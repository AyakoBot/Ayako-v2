import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('ping')
 .setDescription(`Display ${process.env.mainName}'s Ping`)
 .setContexts([
  Discord.InteractionContextType.BotDM,
  Discord.InteractionContextType.Guild,
  Discord.InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  Discord.ApplicationIntegrationType.GuildInstall,
  Discord.ApplicationIntegrationType.UserInstall,
 ]);
