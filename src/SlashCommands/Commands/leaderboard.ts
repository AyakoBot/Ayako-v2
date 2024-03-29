import * as Discord from 'discord.js';

const User = new Discord.SlashCommandUserOption()
 .setName('user')
 .setDescription('The User')
 .setRequired(false);

export default new Discord.SlashCommandBuilder()
 .setName('leaderboard')
 .setDescription('Leaderboard and Rank Commands')
 .setDMPermission(false)
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
 );
