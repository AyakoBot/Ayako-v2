import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

export default new SlashCommandBuilder()
 .setName('ping')
 .setDescription(`Display ${process.env.mainName}'s Ping`)
 .setContexts([
  InteractionContextType.BotDM,
  InteractionContextType.Guild,
  InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  ApplicationIntegrationType.GuildInstall,
  ApplicationIntegrationType.UserInstall,
 ]);
