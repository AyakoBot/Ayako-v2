import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('membercount')
 .setDescription('Display the Membercount of a Server')
 .setDMPermission(false);
