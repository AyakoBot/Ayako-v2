import * as Discord from 'discord.js';
import { GuildTextChannelTypes } from '../../../../BaseClient/Other/constants.js';

export default new Discord.SlashCommandBuilder()
 .setName('giveaway')
 .setDescription('Giveaway Management Commands')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .setDMPermission(false)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('create')
   .setDescription('Create a Giveaway')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('prize-description')
     .setDescription('The Prize of the Giveaway')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('time')
     .setDescription('The Time of the Giveaway (1d 2h 5m)')
     .setRequired(true),
   )
   .addIntegerOption(
    new Discord.SlashCommandIntegerOption()
     .setName('winners')
     .setDescription('The Amount of Winners')
     .setMinValue(1)
     .setMaxValue(100)
     .setRequired(true),
   )
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel where the Giveaway should be created')
     .setRequired(false)
     .addChannelTypes(...GuildTextChannelTypes),
   )
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role that is required to enter the Giveaway')
     .setRequired(false),
   )
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('host')
     .setDescription('The Host of the Giveaway')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('prize')
     .setDescription("The Prize of the Giveaway (will be DM'd to the Winner(s) if set)")
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('claiming-timeout')
     .setDescription('The Time during which the Winners can claim their Prize (1d 2h 5m)')
     .setRequired(false),
   )
   .addBooleanOption(
    new Discord.SlashCommandBooleanOption()
     .setName('claim-fail-reroll')
     .setDescription(
      'Whether the Giveaway should be rerolled if a Winner fails to claim their Prize',
     )
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('end')
   .setDescription('End a Giveaway prematurely')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('message-id')
     .setDescription('The Message ID of the Giveaway')
     .setAutocomplete(true)
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('reroll')
   .setDescription('Reroll a Giveaway')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('message-id')
     .setDescription('The Message ID of the Giveaway')
     .setAutocomplete(true)
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder().setName('list').setDescription('List all Giveaways'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('edit')
   .setDescription('Edit a Giveaway')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('message-id')
     .setDescription('The Message ID of the Giveaway')
     .setAutocomplete(true)
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('prize-description')
     .setDescription('The Prize of the Giveaway')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('time')
     .setDescription('The Time of the Giveaway (1d 2h 5m)')
     .setRequired(false),
   )
   .addIntegerOption(
    new Discord.SlashCommandIntegerOption()
     .setName('winners')
     .setDescription('The Amount of Winners')
     .setMinValue(1)
     .setMaxValue(100)
     .setRequired(false),
   )
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role that is required to enter the Giveaway')
     .setRequired(false),
   )
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('host')
     .setDescription('The Host of the Giveaway')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('prize')
     .setDescription('The Prize of the Giveaway (Winners will be able to claim it if set)')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('claiming-timeout')
     .setDescription('The Time during which the Winners can claim their Prize (1d 2h 5m)')
     .setRequired(false),
   )
   .addBooleanOption(
    new Discord.SlashCommandBooleanOption()
     .setName('claim-fail-reroll')
     .setDescription(
      'Whether the Giveaway should be rerolled if a Winner fails to claim their Prize',
     )
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('cancel')
   .setDescription('Cancel a Giveaway')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('message-id')
     .setDescription('The Message ID of the Giveaway')
     .setAutocomplete(true)
     .setRequired(true),
   ),
 );
