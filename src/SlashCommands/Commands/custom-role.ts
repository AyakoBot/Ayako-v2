import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('custom-role')
 .setDMPermission(false)
 .setDescription('Create a custom Role')
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('name')
   .setDescription('The Name of your custom Role')
   .setMaxLength(100)
   .setRequired(false),
 )
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('color')
   .setDescription('The new Color of the Role (Hex Code)')
   .setMaxLength(6)
   .setRequired(false),
 )
 .addRoleOption(
  new Discord.SlashCommandRoleOption()
   .setName('color-role')
   .setDescription('The Role to copy the Color from')
   .setRequired(false),
 )
 .addAttachmentOption(
  new Discord.SlashCommandAttachmentOption()
   .setName('icon')
   .setDescription('The new Icon of the Role')
   .setRequired(false),
 )
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('icon-emoji')
   .setDescription('The new Icon of the Role derived from an Emoji')
   .setRequired(false),
 )
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('icon-url')
   .setDescription('The new Icon of the Role derived from a URL')
   .setRequired(false),
 );
