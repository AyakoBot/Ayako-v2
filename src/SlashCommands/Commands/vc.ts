import {
 ApplicationIntegrationType,
 ChannelType,
 InteractionContextType,
 SlashCommandBuilder,
 SlashCommandChannelOption,
 SlashCommandSubcommandBuilder,
 SlashCommandSubcommandGroupBuilder,
 SlashCommandUserOption,
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
 );
