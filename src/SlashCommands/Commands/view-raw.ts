import * as Discord from 'discord.js';

export default new Discord.ContextMenuCommandBuilder()
 .setName('View Raw')
 .setType(Discord.ApplicationCommandType.Message)
 .setContexts([
  Discord.InteractionContextType.Guild,
  Discord.InteractionContextType.BotDM,
  Discord.InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  Discord.ApplicationIntegrationType.GuildInstall,
  Discord.ApplicationIntegrationType.UserInstall,
 ]);
