import * as Discord from 'discord.js';

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
 .setName('clear')
 .setDescription('Clear the provided Amount of Messages from a Channel')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
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
 );
