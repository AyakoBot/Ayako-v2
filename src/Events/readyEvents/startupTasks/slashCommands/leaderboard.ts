import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('leaderboard')
 .setDescription('Shows the Leaderboard of the Server')
 .setDMPermission(false);
