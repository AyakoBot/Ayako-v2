import * as Discord from 'discord.js';
import { AllNonThreadGuildChannelTypes } from '../../Typings/Channel.js';

export default new Discord.SlashCommandBuilder()
 .setName('invites')
 .setDescription('Detailed Information and Utilities about Invites')
 .setDMPermission(false)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Get Information about an Invite')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('invite')
     .setDescription('The Invite')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('create')
   .setDescription('Create an Invite')
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel where the Invite should be created')
     .setRequired(false)
     .addChannelTypes(...AllNonThreadGuildChannelTypes),
   )
   .addIntegerOption(
    new Discord.SlashCommandIntegerOption()
     .setName('max-uses')
     .setDescription('The Maximum Amount of Uses')
     .setMaxValue(100)
     .setMinValue(1)
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('max-age')
     .setDescription('The Maximum Age (Between 0 and 7 Days (Example: 4d 2 h 5 mins))')
     .setRequired(false),
   )
   .addBooleanOption(
    new Discord.SlashCommandBooleanOption()
     .setName('temporary')
     .setDescription('Whether the Invite grants temporary Membership')
     .setRequired(false),
   )
   .addBooleanOption(
    new Discord.SlashCommandBooleanOption()
     .setName('unique')
     .setDescription('Whether the Invite should be unique')
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('delete')
   .setDescription('Delete an Invite')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('invite')
     .setDescription('The Invite')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('reason')
     .setDescription('The Reason')
     .setRequired(false),
   ),
 );
