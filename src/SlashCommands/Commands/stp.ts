import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('stp')
 .setDescription('String Replace Test')
 .setDMPermission(true)
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('string')
   .setDescription('The String to replace')
   .setRequired(true),
 );
