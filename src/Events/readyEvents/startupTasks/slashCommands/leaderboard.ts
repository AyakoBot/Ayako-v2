import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('leaderboard')
 .setDescription('Leaderboard Commands')
 .setDMPermission(false)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('nitro')
   .setDescription('Shows the Leaderboard of Members who boosted the Server'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('global')
   .setDescription('Shows the global Leaderboard'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('server')
   .setDescription('Shows the server Leaderboard'),
 );
