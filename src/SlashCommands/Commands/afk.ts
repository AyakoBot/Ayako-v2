import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('afk')
 .setDescription('Set your AFK Status')
 .setDMPermission(false)
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('reason')
   .setDescription('The Reason for being AFK')
   .setRequired(false),
 );
