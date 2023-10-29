import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('vote')
 .setDescription('Vote for Ayako on Top.gg!')
 .setDMPermission(true);
