import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('reminder')
 .setDescription('Reminder Commands')
 .setDMPermission(true)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('create')
   .setDescription('Create a Reminder')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('duration')
     .setDescription('The Duration (Example: 4d 30m 12s)')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('content')
     .setDescription('The Content')
     .setMinLength(1)
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('list')
   .setDescription('List all of your Reminders'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('edit')
   .setDescription('Edit a Reminder')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('id')
     .setDescription('The ID of the Reminder')
     .setRequired(true)
     .setAutocomplete(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('content')
     .setDescription('The new Content')
     .setMinLength(1)
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('delete')
   .setDescription('Delete a Reminder')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('id')
     .setDescription('The ID of the Reminder')
     .setRequired(true)
     .setAutocomplete(true),
   ),
 );
