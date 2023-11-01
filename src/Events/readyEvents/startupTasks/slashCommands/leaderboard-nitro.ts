import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('leaderboard-nitro')
 .setDescription('Shows the Leaderboard of Members who boost the Server')
 .setDMPermission(false);
