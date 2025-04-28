import * as Discord from 'discord.js';

const name = new Discord.SlashCommandStringOption()
 .setName('name')
 .setDescription('The Name of your Custom-Role')
 .setMaxLength(100)
 .setRequired(false);

const color = new Discord.SlashCommandStringOption()
 .setName('color')
 .setDescription('The new Color of the Role (Hex Code)')
 .setMaxLength(6)
 .setRequired(false);

const role = new Discord.SlashCommandRoleOption()
 .setName('color-role')
 .setDescription('The Role to copy the Color from')
 .setRequired(false);

const icon = new Discord.SlashCommandAttachmentOption()
 .setName('icon')
 .setDescription('The new Icon of the Role')
 .setRequired(false);

const iconEmoji = new Discord.SlashCommandStringOption()
 .setName('icon-emoji')
 .setDescription('The new Icon of the Role derived from an Emoji')
 .setRequired(false);

const iconURL = new Discord.SlashCommandStringOption()
 .setName('icon-url')
 .setDescription('The new Icon of the Role derived from a URL')
 .setRequired(false);

export default new Discord.SlashCommandBuilder()
 .setName('custom-role')
 .setDescription('Create a Custom-Role')
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('create')
   .setDescription('Create a custom role')
   .setDescription('Edit a custom role')
   .addStringOption(name)
   .addStringOption(color)
   .addRoleOption(role)
   .addAttachmentOption(icon)
   .addStringOption(iconEmoji)
   .addStringOption(iconURL),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('edit')
   .setDescription('Edit a custom role')
   .addStringOption(name)
   .addStringOption(color)
   .addRoleOption(role)
   .addAttachmentOption(icon)
   .addStringOption(iconEmoji)
   .addStringOption(iconURL),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('share')
   .setDescription('Share a Custom-Role'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('claim-shared')
   .setDescription('Claim a shared Custom-Role')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('role')
     .setDescription('The Role to claim')
     .setRequired(true)
     .setAutocomplete(true),
   ),
 );
