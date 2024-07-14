import * as Discord from 'discord.js';

const EmojiName = new Discord.SlashCommandStringOption()
 .setName('name')
 .setDescription('The Name of the Emoji')
 .setMaxLength(32)
 .setMinLength(2)
 .setRequired(true);

export default new Discord.SlashCommandBuilder()
 .setName('emojis')
 .setDescription('Detailed Information and Utilities about Emojis')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Information about many Emojis of the Server, or a specific Emoji')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('emoji')
     .setDescription('The Emoji to get Information about')
     .setRequired(false),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('create')
   .setDescription('Create a new Emoji')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-url')
     .setDescription('Create an Emoji from a URL')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('url')
       .setDescription('The URL to create the Emoji from')
       .setRequired(true),
     )
     .addStringOption(EmojiName),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-file')
     .setDescription('Create an Emoji from a File')

     .addAttachmentOption(
      new Discord.SlashCommandAttachmentOption()
       .setName('file')
       .setDescription('The File to create the Emoji from')
       .setRequired(true),
     )
     .addStringOption(EmojiName),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-emoji')
     .setDescription('Create an Emoji from another Emoji')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('emoji')
       .setDescription('The Emoji to create the Emoji from')
       .setRequired(true),
     )
     .addStringOption(EmojiName),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('delete')
   .setDescription('Delete an Emoji')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('emoji')
     .setDescription('The Emoji to delete')
     .setRequired(true),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('edit')
   .setDescription('Edit an Emoji')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('name')
     .setDescription('Edit an Emoji')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('emoji')
       .setDescription('The Emoji to edit')
       .setRequired(true),
     )
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('name')
       .setDescription('The new Name of the Emoji')
       .setMaxLength(32)
       .setMinLength(2)
       .setRequired(true),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('roles')
     .setDescription('Edit the Roles that can use an Emoji')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('emoji')
       .setDescription('The Emoji to edit')
       .setRequired(true),
     ),
   ),
 );
