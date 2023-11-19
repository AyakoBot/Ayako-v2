import * as Discord from 'discord.js';

const StickerName = new Discord.SlashCommandStringOption()
 .setName('name')
 .setDescription('The Name of the Sticker')
 .setMaxLength(30)
 .setMinLength(2)
 .setRequired(true);

const StickerDescription = new Discord.SlashCommandStringOption()
 .setName('description')
 .setDescription('The Description of the Sticker')
 .setRequired(true)
 .setMaxLength(100);

const RelatedEmoji = new Discord.SlashCommandStringOption()
 .setName('emoji')
 .setDescription('The related Emoji')
 .setRequired(true)
 .setAutocomplete(true);

export default new Discord.SlashCommandBuilder()
 .setName('stickers')
 .setDMPermission(false)
 .setDescription('Detailed Information and Utilities about Sticker')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Information about many Stickers of the Server, or a specific Sticker')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('sticker')
     .setDescription('The Sticker to get Information about (Can also be a Message Link)')
     .setRequired(false)
     .setAutocomplete(true),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('create')
   .setDescription('Create a new Sticker')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-message')
     .setDescription('Create a Sticker from Message Link')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('link')
       .setDescription('The Message Link to create the Sticker from')
       .setRequired(true),
     )
     .addStringOption(StickerName)
     .addStringOption(StickerDescription)
     .addStringOption(RelatedEmoji)
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setDescription('The Name of the Sticker to clone (if the Message it has multiple Stickers)')
       .setName('sticker-name')
       .setAutocomplete(true)
       .setRequired(false)
       .setMaxLength(30),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-file')
     .setDescription('Create a Sticker from a File')
     .addAttachmentOption(
      new Discord.SlashCommandAttachmentOption()
       .setName('file')
       .setDescription('The File to create the Sticker from')
       .setRequired(true),
     )
     .addStringOption(StickerName)
     .addStringOption(StickerDescription)
     .addStringOption(RelatedEmoji),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('delete')
   .setDescription('Delete an Sticker')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('sticker')
     .setDescription('The Sticker to delete')
     .setRequired(true)
     .setAutocomplete(true),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('edit')
   .setDescription('Edit a Sticker')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('name')
     .setDescription('Edit a Sticker')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('sticker')
       .setDescription('The Sticker to edit')
       .setAutocomplete(true)
       .setRequired(true),
     )
     .addStringOption(StickerName),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('description')
     .setDescription('Edit the Description of the Sticker')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('sticker')
       .setDescription('The Sticker to edit')
       .setAutocomplete(true)
       .setRequired(true),
     )
     .addStringOption(StickerDescription),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('emoji')
     .setDescription('Edit the Emoji of the Sticker')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('sticker')
       .setDescription('The Sticker to edit')
       .setAutocomplete(true)
       .setRequired(true),
     )
     .addStringOption(RelatedEmoji),
   ),
 );
