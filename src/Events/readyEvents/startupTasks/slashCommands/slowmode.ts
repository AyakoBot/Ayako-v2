import * as Discord from 'discord.js';
import { GuildTextChannelTypes } from '../../../../BaseClient/Other/constants.js';

export default new Discord.SlashCommandBuilder()
 .setName('slowmode')
 .setDescription('Set the Slowmode of a Channel')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
 .setDMPermission(false)
 .addChannelOption(
  new Discord.SlashCommandChannelOption()
   .setName('channel')
   .setDescription('The Channel to set the Slowmode in')
   .setRequired(true)
   .addChannelTypes(...GuildTextChannelTypes),
 )
 .addNumberOption(
  new Discord.SlashCommandNumberOption()
   .setName('time')
   .setDescription('The Slowmode in Seconds')
   .setRequired(true)
   .setMaxValue(21600),
 );
