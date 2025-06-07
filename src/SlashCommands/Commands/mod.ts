import * as Discord from 'discord.js';
import { AllNonThreadGuildChannelTypes, GuildTextChannelTypes } from '../../Typings/Channel.js';

const Target = new Discord.SlashCommandUserOption()
 .setName('target')
 .setDescription('The Target')
 .setRequired(true);

const User = new Discord.SlashCommandUserOption()
 .setName('user')
 .setDescription('The User')
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

const RequiredDuration = new Discord.SlashCommandStringOption()
 .setName(Duration.name)
 .setDescription(Duration.description)
 .setRequired(true);

const DeleteMessageDuration = new Discord.SlashCommandStringOption()
 .setName('delete-message-duration')
 .setDescription('Since how long ago Messages of this User should be deleted (Example: 1d 2h 5m)')
 .setRequired(false);

const Amount = new Discord.SlashCommandIntegerOption()
 .setName('amount')
 .setDescription('The Amount of matching Messages to delete')
 .setMaxValue(500)
 .setMinValue(2)
 .setRequired(true);

const FilterContent = new Discord.SlashCommandStringOption()
 .setName('content')
 .setDescription('The Content (case-insensitive)')
 .setMinLength(1)
 .setRequired(true);

const Channel = new Discord.SlashCommandChannelOption()
 .setName('channel')
 .setDescription('The Channel to delete Messages from')
 .setRequired(false)
 .addChannelTypes(
  ...([
   Discord.ChannelType.AnnouncementThread,
   Discord.ChannelType.PublicThread,
   Discord.ChannelType.GuildAnnouncement,
   Discord.ChannelType.PrivateThread,
   Discord.ChannelType.GuildStageVoice,
   Discord.ChannelType.GuildText,
   Discord.ChannelType.GuildVoice,
  ] as const),
 );

export default new Discord.SlashCommandBuilder()
 .setName('mod')
 .setDescription('Moderation Commands')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('permissions')
   .setDescription('Manage Appearance and Permissions of Moderation Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('tempmute')
   .setDescription('Temporarily Mutes a User')
   .addUserOption(User)
   .addStringOption(RequiredDuration)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unmute')
   .setDescription('Unmutes a User')
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('ban')
   .setDescription('Bans a User')
   .addUserOption(User)
   .addStringOption(Duration)
   .addStringOption(Reason)
   .addStringOption(DeleteMessageDuration),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unban')
   .setDescription('Un-Bans a User')
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('soft-ban')
   .setDescription('Soft-Bans a User (Bans and instantly Un-Bans them)')
   .addUserOption(User)
   .addStringOption(Reason)
   .addStringOption(DeleteMessageDuration),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('temp-ban')
   .setDescription('Temporarily Bans a User')
   .addUserOption(User)
   .addStringOption(RequiredDuration)
   .addStringOption(Reason)
   .addStringOption(DeleteMessageDuration),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('channel-ban')
   .setDescription('Bans a User from a Channel')
   .addUserOption(User)
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
   .addUserOption(User)
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel')
     .addChannelTypes(...AllNonThreadGuildChannelTypes)
     .setRequired(true),
   )
   .addStringOption(RequiredDuration)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('channel-unban')
   .setDescription('Temporarily Bans a User from a Channel')
   .addUserOption(User)
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
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('warn')
   .setDescription('Warns a User')
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('soft-warn')
   .setDescription("Soft-Warns a User (Doesn't save the Warn, only notifies the User)")
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('strike')
   .setDescription(`Strikes a User (Let's ${process.env.mainName} decide what Punishment to apply)`)
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unafk')
   .setDescription("Force delete someone's AFK status")
   .addUserOption(User)
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
        { name: 'VC-Mute', value: 'vcmute' },
        { name: 'VC-Deaf', value: 'vcdeaf' },
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
     .setDescription(
      `Username of the User (Searches across all of ${process.env.mainName}'s Servers)`,
     )
     .setRequired(false)
     .setMinLength(2)
     .setAutocomplete(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('edit')
   .setDescription('Edit the Reason of a Punishment')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('id')
     .setDescription('The ID of the Punishment')
     .setRequired(true)
     .setMinLength(8)
     .setMaxLength(8),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('reason')
     .setDescription('The Reason')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('slowmode')
   .setDescription('Set the Slowmode of a Channel')
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
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('vc-mute')
   .setDescription('Mute a User in a Voice Channel')
   .addUserOption(User)
   .addStringOption(Duration)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('vc-deafen')
   .setDescription('Deafen a User in a Voice Channel')
   .addUserOption(User)
   .addStringOption(Duration)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('vc-unmute')
   .setDescription('Unmute a User in a Voice Channel')
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('vc-undeafen')
   .setDescription('Undeafen a User in a Voice Channel')
   .addUserOption(User)
   .addStringOption(Reason),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('clear')
   .setDescription('Clear the provided Amount of Messages from a Channel')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('all')
     .setDescription('Clear Messages from a Channel')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('user')
     .setDescription('Clear Messages that are sent by a User')
     .addIntegerOption(Amount)
     .addUserOption(
      new Discord.SlashCommandUserOption()
       .setName('user')
       .setDescription('The User')
       .setRequired(true),
     )
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('between')
     .setDescription('Clear Messages between 2 Messages')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('first-message-url')
       .setDescription('The Message URL (or ID) of the first Message')
       .setRequired(true)
       .setMinLength(17)
       .setMaxLength(95),
     )
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('second-message-url')
       .setDescription(
        'The Message URL (or ID) of the second Message (if not provided, last sent Message will be used)',
       )
       .setRequired(false)
       .setMinLength(17)
       .setMaxLength(95),
     )
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('match')
     .setDescription('Clear Messages that match the provided Content')
     .addIntegerOption(Amount)
     .addStringOption(FilterContent)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('not-match')
     .setDescription("Clear Messages that don't match the provided Content")
     .addIntegerOption(Amount)
     .addStringOption(FilterContent)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('starts-with')
     .setDescription('Clear Messages that start with the provided Content')
     .addIntegerOption(Amount)
     .addStringOption(FilterContent)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('ends-with')
     .setDescription('Clear Messages that end with the provided Content')
     .addIntegerOption(Amount)
     .addStringOption(FilterContent)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('includes')
     .setDescription('Clear Messages that include the provided Content')
     .addIntegerOption(Amount)
     .addStringOption(FilterContent)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('links')
     .setDescription('Clear Messages that have Links')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('invites')
     .setDescription('Clear Messages that have Invites')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('images')
     .setDescription('Clear Messages that have Images')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('videos')
     .setDescription('Clear Messages that have Videos')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('files')
     .setDescription('Clear Messages that have any type of Files')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('audio')
     .setDescription('Clear Messages that have Audio')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('mentions')
     .setDescription('Clear Messages that mention anything')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('stickers')
     .setDescription('Clear Messages that have Stickers')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('embeds')
     .setDescription('Clear Messages that have Embeds')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('text')
     .setDescription('Clear Messages that have only Text')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('humans')
     .setDescription('Clear Messages that are sent by Humans')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('bots')
     .setDescription('Clear Messages that are sent by Bots')
     .addIntegerOption(Amount)
     .addChannelOption(Channel),
   ),
 );
