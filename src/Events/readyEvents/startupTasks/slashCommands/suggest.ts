import * as Discord from 'discord.js';

const suggest = new Discord.SlashCommandBuilder()
 .setName('suggest')
 .setDescription('Submit a new Suggestion')
 .setDMPermission(false)
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('content')
   .setDescription('The Content of the Suggestion')
   .setRequired(true),
 );

new Array(5)
 .fill(null)
 .forEach((_, i) =>
  suggest.addAttachmentOption(
   new Discord.SlashCommandAttachmentOption()
    .setName(`attachment-${i}`)
    .setDescription('An Attachment for the Suggestion')
    .setRequired(false),
  ),
 );

export default suggest;
