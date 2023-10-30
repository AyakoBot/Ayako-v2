import * as Discord from 'discord.js';
import { AllNonThreadGuildChannelTypes } from '../../../../BaseClient/Other/constants.js';
import client from '../../../../BaseClient/Client.js';

const name = client.user?.username;

const Target = new Discord.SlashCommandUserOption()
 .setName('target')
 .setDescription('The Target')
 .setRequired(true);

const Executor = new Discord.SlashCommandUserOption()
 .setName('executor')
 .setDescription('The Executor')
 .setRequired(true);

const Reason = new Discord.SlashCommandStringOption()
 .setName('reason')
 .setDescription('The Reason')
 .setRequired(false);

const Duration = new Discord.SlashCommandStringOption()
 .setName('duration')
 .setDescription('The Duration (Example: 4d 30m 12s)')
 .setRequired(false);

const DeleteMessageDuration = new Discord.SlashCommandStringOption()
 .setName('delete-message-duration')
 .setDescription('Since how long ago Messages of this User should be deleted (Example: 1d 2h 5m)')
 .setRequired(false);

export default new Discord.SlashCommandBuilder()
 .setName('mod')
 .setDescription('Moderation Commands')
 .setDMPermission(false)
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('permissions')
   .setDescription('Manage Appearance and Permissions of Moderation Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('tempmute')
   .setDescription('Temporarily Mutes a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('duration')
     .setDescription('The Duration (Example: 4d 30m 12s)')
     .setRequired(false),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unmute')
   .setDescription('Unmutes a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('ban')
   .setDescription('Bans a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Duration)
   .addStringOption(Reason)
   .addStringOption(DeleteMessageDuration),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unban')
   .setDescription('Un-Bans a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('soft-ban')
   .setDescription('Soft-Bans a User (Bans and instantly Un-Bans them)')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason)
   .addStringOption(DeleteMessageDuration),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('temp-ban')
   .setDescription('Temporarily Bans a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('duration')
     .setDescription('The Duration (Example: 4d 30m 12s)')
     .setRequired(true),
   )
   .addStringOption(Reason)
   .addStringOption(DeleteMessageDuration),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('channel-ban')
   .setDescription('Bans a User from a Channel')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel')
     .addChannelTypes(...AllNonThreadGuildChannelTypes)
     .setRequired(true),
   )
   .addStringOption(Duration)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('temp-channel-ban')
   .setDescription('Temporarily Bans a User from a Channel')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel')
     .addChannelTypes(...AllNonThreadGuildChannelTypes)
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('duration')
     .setDescription('The Duration (Example: 4d 30m 12s)')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('channel-unban')
   .setDescription('Temporarily Bans a User from a Channel')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel')
     .addChannelTypes(...AllNonThreadGuildChannelTypes)
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('kick')
   .setDescription('Kicks a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('warn')
   .setDescription('Warns a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('soft-warn')
   .setDescription("Soft-Warns a User (Doesn't save the Warn, only notifies the User)")
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('strike')
   .setDescription(`Strikes a User (Let's ${name} decide what Punishment to apply)`)
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unafk')
   .setDescription("Force delete someone's AFK status")
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   )
   .addStringOption(Reason),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('pardon')
   .setDescription('Pardon a Punishment from a User')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('one')
     .setDescription('Pardon a specific Punishment from a User')
     .addUserOption(Target)
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('type')
       .setDescription('The Type of the Punishment')
       .setRequired(true)
       .setChoices(
        { name: 'Ban', value: 'ban' },
        { name: 'Mute', value: 'mute' },
        { name: 'Kick', value: 'kick' },
        { name: 'Warn', value: 'warn' },
        { name: 'Channel-Ban', value: 'channelban' },
       ),
     )
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('id')
       .setDescription('The ID of the Punishment to Pardon')
       .setRequired(true)
       .setMinLength(8)
       .setMaxLength(8)
       .setAutocomplete(true),
     )
     .addStringOption(Reason),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('before')
     .setDescription('Pardon all Punishment from a User before a specific Date')
     .addUserOption(Target)
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('date')
       .setDescription('The Date (D/M/YY or DD/MM/YYYY)')
       .setMinLength(6)
       .setMaxLength(10)
       .setRequired(true),
     )
     .addStringOption(Reason),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('after')
     .setDescription('Pardon all Punishment from a User after a specific Date')
     .addUserOption(Target)
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('date')
       .setDescription('The Date (D/M/YY or DD/MM/YYYY)')
       .setMinLength(6)
       .setMaxLength(10)
       .setRequired(true),
     )
     .addStringOption(Reason),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('between')
     .setDescription('Pardon all Punishment from a User between 2 specific Dates')
     .addUserOption(Target)
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('date-1')
       .setDescription('The first Date (D/M/YY or DD/MM/YYYY)')
       .setMinLength(6)
       .setMaxLength(10)
       .setRequired(true),
     )
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('date-2')
       .setDescription('The second Date (D/M/YY or DD/MM/YYYY)')
       .setMinLength(6)
       .setMaxLength(10)
       .setRequired(true),
     )
     .addStringOption(Reason),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('by')
     .setDescription('Pardon all Punishment from a User executed by a specific User')
     .addUserOption(Executor)
     .addUserOption(Target)
     .addStringOption(Reason),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('all-by')
     .setDescription('Pardon all Punishment executed by a specific User')
     .addUserOption(Executor)
     .addStringOption(Reason),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('all-on')
     .setDescription('Pardon all Punishment from a User')
     .addUserOption(Target)
     .addStringOption(Reason),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('check')
   .setDescription('View all Punishments of a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('user-name')
     .setDescription(`Username of the User (Searches across all of ${name}'s Servers)`)
     .setRequired(false)
     .setMinLength(2)
     .setAutocomplete(true),
   ),
 );
