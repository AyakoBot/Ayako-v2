import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('shop')
 .setDescription('Buy Roles with earned Currency')
 .setDMPermission(false);
