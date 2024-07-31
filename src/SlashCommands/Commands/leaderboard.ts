import * as Discord from 'discord.js';
import { GuildTextChannelTypes } from '../../Typings/Channel.js';

const User = new Discord.SlashCommandUserOption()
 .setName('user')
 .setDescription('The User')
 .setRequired(false);

const Channel = new Discord.SlashCommandChannelOption()
 .setName('channel')
 .setDescription('The Channel')
 .setRequired(false)
 .addChannelTypes(...GuildTextChannelTypes);

export default new Discord.SlashCommandBuilder()
 .setName('leaderboard')
 .setDescription('Leaderboard and Rank Commands')
 .setContexts([
  Discord.InteractionContextType.BotDM,
  Discord.InteractionContextType.Guild,
  Discord.InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  Discord.ApplicationIntegrationType.GuildInstall,
  Discord.ApplicationIntegrationType.UserInstall,
 ])
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('nitro')
   .setDescription('Shows the Leaderboard and Rank of Members who boosted the Server')
   .addUserOption(User),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('global')
   .setDescription('Shows the global Leaderboard and Rank')
   .addUserOption(User),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('server')
   .setDescription('Shows the server Leaderboard and Rank')
   .addUserOption(User),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('channel')
   .setDescription('Shows the Channel Leaderboard and Rank')
   .addChannelOption(Channel)
   .addUserOption(User),
 );
