import {
 ApplicationIntegrationType,
 ChannelType,
 InteractionContextType,
 SlashCommandBooleanOption,
 SlashCommandBuilder,
 SlashCommandChannelOption,
 SlashCommandIntegerOption,
 SlashCommandStringOption,
 SlashCommandSubcommandBuilder,
 SlashCommandSubcommandGroupBuilder,
 SlashCommandUserOption,
 VideoQualityMode,
} from 'discord.js';

const VoiceChannel = new SlashCommandChannelOption()
 .setName('channel')
 .setDescription('The Voice-Channel')
 .setRequired(false)
 .addChannelTypes(ChannelType.GuildVoice);

const VoiceHub = new SlashCommandChannelOption()
 .setName('hub')
 .setDescription('The Voice-Hub to create a Voice-Channel from')
 .setRequired(true)
 .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice);

export default new SlashCommandBuilder()
 .setName('vc')
 .setDescription('Voice-Hub Management Commands')
 .setContexts(InteractionContextType.Guild)
 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 .addSubcommand(
  new SlashCommandSubcommandBuilder()
   .setName('create')
   .setDescription('Create a Voice-Channel from a Voice-Hub')
   .addChannelOption(VoiceHub),
 )
 .addSubcommand(
  new SlashCommandSubcommandBuilder()
   .setName('delete')
   .setDescription('Delete a Voice-Channel')
   .addChannelOption(VoiceChannel),
 )
 .addSubcommandGroup(
  new SlashCommandSubcommandGroupBuilder()
   .setName('add')
   .setDescription('Add a User to a VC')
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('member')
     .setDescription('Add a Member to a VC')
     .addUserOption(
      new SlashCommandUserOption()
       .setName('user')
       .setDescription('The User to add as a VC Member')
       .setRequired(true),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('manager')
     .setDescription('Add a Manager to a VC')
     .addUserOption(
      new SlashCommandUserOption()
       .setName('user')
       .setDescription('The User to add as a VC Manager')
       .setRequired(true),
     )
     .addChannelOption(VoiceChannel),
   ),
 )
 .addSubcommandGroup(
  new SlashCommandSubcommandGroupBuilder()
   .setName('remove')
   .setDescription('Remove a User from a VC')
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('all-members')
     .setDescription('Remove all Members from a VC')
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('all-managers')
     .setDescription('Remove all Managers from a VC')
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('all')
     .setDescription('Remove all Members and Managers from a VC')
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('member')
     .setDescription('Remove a Member from a VC')
     .addUserOption(
      new SlashCommandUserOption()
       .setName('user')
       .setDescription('The Member to Remove from the VC')
       .setRequired(true),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('manager')
     .setDescription('Remove a Manager from a VC')
     .addUserOption(
      new SlashCommandUserOption()
       .setName('user')
       .setDescription('The Manager to demote to a Member of the VC')
       .setRequired(true),
     )
     .addChannelOption(VoiceChannel),
   ),
 )
 .addSubcommandGroup(
  new SlashCommandSubcommandGroupBuilder()
   .setName('edit')
   .setDescription('Edit a VC')
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('name')
     .setDescription('Edit the Name of a VC')
     .addStringOption(
      new SlashCommandStringOption()
       .setName('name')
       .setDescription('The new Name of the VC')
       .setRequired(true)
       .setMinLength(1)
       .setMaxLength(100),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('slowmode')
     .setDescription('Edit the Slowmode of a VC')
     .addStringOption(
      new SlashCommandStringOption()
       .setName('slowmode')
       .setDescription('The new Slowmode of the VC (Example: 5m 20s 6h)')
       .setRequired(true)
       .setMinLength(1)
       .setMaxLength(100),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('nsfw')
     .setDescription('Edit the NSFW-State of a VC')
     .addBooleanOption(
      new SlashCommandBooleanOption()
       .setName('nsfw')
       .setDescription('The new NSFW-State of the VC')
       .setRequired(true),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('bitrate')
     .setDescription('Edit the Bitrate of a VC')
     .addIntegerOption(
      new SlashCommandIntegerOption()
       .setName('bitrate')
       .setDescription('The new Bitrate of the VC (in kbps)')
       .setRequired(true)
       .setMinValue(8)
       .setMaxValue(384),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('video-quality')
     .setDescription('Edit the Video-Quality of a VC')
     .addStringOption(
      new SlashCommandStringOption()
       .setName('quality')
       .setDescription('The new Quality of the VC')
       .setRequired(true)
       .setChoices(
        { name: 'Auto', value: String(VideoQualityMode.Auto) },
        { name: '720p', value: String(VideoQualityMode.Full) },
       ),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('user-limit')
     .setDescription('Edit the User-Limit of a VC (0 = no limit)')
     .addIntegerOption(
      new SlashCommandIntegerOption()
       .setName('limit')
       .setDescription('The new User-Limit of the VC')
       .setRequired(true)
       .setMinValue(0)
       .setMaxValue(99),
     )
     .addChannelOption(VoiceChannel),
   )
   .addSubcommand(
    new SlashCommandSubcommandBuilder()
     .setName('region')
     .setDescription('Edit the Region of a VC')
     .addStringOption(
      new SlashCommandStringOption()
       .setName('region')
       .setDescription('The new Region of the VC')
       .setRequired(true)
       .setChoices([
        { name: 'Automatic', value: 'Automatic' },
        { name: 'Brazil', value: 'brazil' },
        { name: 'Hong Kong', value: 'hongkong' },
        { name: 'India', value: 'india' },
        { name: 'Japan', value: 'japan' },
        { name: 'Rotterdam', value: 'rotterdam' },
        { name: 'Russia', value: 'russia' },
        { name: 'Singapore', value: 'singapore' },
        { name: 'South Africa', value: 'southafrica' },
        { name: 'Sydney', value: 'sydney' },
        { name: 'US Central', value: 'us-central' },
        { name: 'US East', value: 'us-east' },
        { name: 'US South', value: 'us-south' },
        { name: 'US West', value: 'us-west' },
       ]),
     )
     .addChannelOption(VoiceChannel),
   ),
 );
