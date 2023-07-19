import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

// Pre-defined values
const name = client.user?.username;

const IDSelector = new Discord.SlashCommandStringOption()
 .setAutocomplete(true)
 .setDescription('The ID of the Setting')
 .setRequired(false)
 .setName('id');

const SearchUsername = new Discord.SlashCommandStringOption()
 .setName('user-name')
 .setDescription(`Username of the User (Searches across all of ${name}'s Servers)`)
 .setRequired(false)
 .setMinLength(2)
 .setAutocomplete(true);

const User = new Discord.SlashCommandUserOption()
 .setName('user')
 .setDescription('The User')
 .setRequired(false);

const Target = new Discord.SlashCommandUserOption()
 .setName('target')
 .setDescription('The Target')
 .setRequired(true);

const Executor = new Discord.SlashCommandUserOption()
 .setName('executor')
 .setDescription('The Executor')
 .setRequired(true);

const EmojiName = new Discord.SlashCommandStringOption()
 .setName('name')
 .setDescription('The Name of the Emoji')
 .setMaxLength(32)
 .setMinLength(2)
 .setRequired(true);

const Reason = new Discord.SlashCommandStringOption()
 .setName('reason')
 .setDescription('The Reason')
 .setRequired(false);

export const GuildTextChannelTypes = [
 Discord.ChannelType.AnnouncementThread,
 Discord.ChannelType.GuildAnnouncement,
 Discord.ChannelType.GuildStageVoice,
 Discord.ChannelType.GuildText,
 Discord.ChannelType.GuildVoice,
 Discord.ChannelType.PrivateThread,
 Discord.ChannelType.PublicThread,
];

// Commands

const settings = new Discord.SlashCommandBuilder()
 .setName('settings')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .setDescription(`Manage ${name}'s Settings`)
 .setDMPermission(false)
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('moderation')
   .setDescription(`Everything about ${name}'s Moderation`)
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('anti-spam')
     .setDescription('Stop Members from spamming'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('anti-spam-punishments')
     .setDescription('The Punishments to use in Anti-Spam')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('anti-virus')
     .setDescription('Stop Members from posting harmful Links'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('anti-virus-punishments')
     .setDescription('The Punishments to use in Anti-Virus')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('anti-raid')
     .setDescription('Automatically detect Raids and punish Raiders'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('auto-punish')
     .setDescription('Help Moderators punish consistently')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('blacklist')
     .setDescription('Stop Members from using specific Words or Phrases'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('blacklist-punishments')
     .setDescription('The Punishments to use in Blacklist')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('blacklist-rules')
     .setDescription('The Rules of the Blacklist')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('expiry')
     .setDescription('Define when logged Punishments expire'),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('leveling')
   .setDescription(`Everything about ${name}'s Leveling`)
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('basic')
     .setDescription('Reward Members for their activity with Server Levels'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('multi-channels')
     .setDescription('Increase or decrease XP rewarded by Channel')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('multi-roles')
     .setDescription('Increase or decrease XP rewarded by Role')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('level-roles')
     .setDescription('Reward Activity with Level-Roles')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('rule-channels')
     .setDescription('Apply conditional XP rewarded by Action in a Channel')
     .addStringOption(IDSelector),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('nitro')
   .setDescription(`Everything about ${name}'s Nitro-Rewards`)
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('basic')
     .setDescription('Basic Nitro-Reward Settings'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('booster-roles')
     .setDescription(`Reward Members for continuously boosting your Server`)
     .addStringOption(IDSelector),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('vote')
   .setDescription('Everything about Voting for your Bot/Server')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('basic')
     .setDescription(`Basic Settings for Voting on Top.gg`)
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('vote-rewards')
     .setDescription(`Reward Members for Voting for your Bot/Server`)
     .addStringOption(IDSelector),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('roles')
   .setDescription(`Everything about ${name}'s Role Management`)
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('role-rewards')
     .setDescription('Give Rewards to Members for achieving a Role')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('auto-roles')
     .setDescription('Assign Roles to Users and Bots when joining'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('self-roles')
     .setDescription('Let Members pick their own Roles')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('separators')
     .setDescription('Separate Roles into Categories using Category Roles / Role Separators')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('sticky')
     .setDescription('Make Roles and Channel Permissions stick to Members across re-joins'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('reaction-role-settings')
     .setDescription('Let Members pick their own Roles through Reactions')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('reaction-roles')
     .setDescription('Here you define the Reactions and their associated Roles')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('button-role-settings')
     .setDescription('Let Members pick their own Roles through Buttons')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('button-roles')
     .setDescription('Here you define the Buttons and their associated Roles')
     .addStringOption(IDSelector),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('automation')
   .setDescription(`Everything about ${name}'s Automation`)
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('delete-commands')
     .setDescription(`Make ${name} delete Commands and/or Replies`)
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('cooldowns')
     .setDescription(`Assign custom defined Cooldowns to Commands of ${name}`)
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('disboard-reminders')
     .setDescription('Have a Bump reminder remind your Members to bump your Server'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('suggestions')
     .setDescription('Let your Members help you decide through a suggestions Channel'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('verification')
     .setDescription('Make joining Users verify with a Captcha'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('welcome')
     .setDescription('Greet joining Users with a welcome Message'),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('basic')
   .setDescription(`Basic Settings to modify ${name}'s behaviour`),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('logs')
   .setDescription('Log all kinds of Discord Events into a Channel'),
 );

const info = new Discord.SlashCommandBuilder()
 .setName('info')
 .setDescription('Display Information about anything on Discord')
 .setDMPermission(true)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('user')
   .setDescription('Display Information about a User')
   .addUserOption(User)
   .addStringOption(SearchUsername),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('servers')
   .setDescription(`Display all servers ${name} is part of`),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('server')
   .setDescription('Display Information about a Server')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setDescription('The ID of the Server')
     .setRequired(false)
     .setName('server-id'),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('server-name')
     .setDescription(`Name of the Server (Searches across all of ${name}'s Servers)`)
     .setRequired(false)
     .setMinLength(1)
     .setAutocomplete(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('server-invite')
     .setDescription('Invite to the Server')
     .setRequired(false)
     .setMinLength(1),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('channel')
   .setDescription('Display Information about a Channel')
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel you want to get Information about')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('role')
   .setDescription('Display Information about a Role')
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role you want to get Information about')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('bot')
   .setDescription(`Display Information about a ${name}`),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('badges')
   .setDescription('Display Information about the Discord Badges Members of this Server have'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('emoji')
   .setDescription('Display Information about an Emoji')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('emoji')
     .setDescription('The Emoji you want to get Information about')
     .setRequired(false),
   ),
 );

const embedbuilder = new Discord.SlashCommandBuilder()
 .setName('embed-builder')
 .setDescription('Everything around Embeds and custom Embeds')
 .setDMPermission(false)
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('view')
   .setDescription('View raw Embed Code')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('custom-embeds')
     .setDescription('View raw Embed Code of your previously saved custom Embeds')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('embed')
       .setDescription('Your saved custom Embeds')
       .setRequired(true)
       .setAutocomplete(true),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-message')
     .setDescription(`View the raw Embed Code of any Message`)
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('message-link')
       .setDescription('The Message Link of the Embeds you want to display')
       .setRequired(true),
     ),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('create')
   .setDescription('Create a new custom Embed'),
 );

const check = new Discord.SlashCommandBuilder()
 .setName('check')
 .setDescription('View all Punishments of a User')
 .setDMPermission(false)
 .addUserOption(User)
 .addStringOption(SearchUsername);

const stickMessage = new Discord.ContextMenuCommandBuilder()
 .setName('Stick Message')
 .setDMPermission(false)
 .setDefaultMemberPermissions(Discord.PermissionsBitField.Flags.ManageMessages)
 .setType(Discord.ApplicationCommandType.Message);

const stp = new Discord.SlashCommandBuilder()
 .setName('stp')
 .setDescription('String Replace Test')
 .setDMPermission(true)
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('string')
   .setDescription('The String to replace')
   .setRequired(true),
 );

const membercount = new Discord.SlashCommandBuilder()
 .setName('membercount')
 .setDescription('Display the Membercount of a Server')
 .setDMPermission(false);

const ping = new Discord.SlashCommandBuilder()
 .setName('ping')
 .setDescription(`Display the ${name}'s Ping`)
 .setDMPermission(true);

const rp = new Discord.SlashCommandBuilder()
 .setName('rp')
 .setDescription('Roleplay Command Manager')
 .setDMPermission(false);

const images = new Discord.SlashCommandBuilder()
 .setName('images')
 .setDescription('Get a random Image')
 .setDMPermission(true)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('neko')
   .setDescription('Get a random Neko Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('husbando')
   .setDescription('Get a random Husbando Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('kitsune')
   .setDescription('Get a random Kitsune Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('waifu')
   .setDescription('Get a random Waifu Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('shinobu')
   .setDescription('Get a random Shinobu Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('megumin')
   .setDescription('Get a random Megumin Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('eevee')
   .setDescription('Get a random Eevee Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('holo')
   .setDescription('Get a random Holo Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('icon')
   .setDescription('Get a random Anime Icon'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('okami')
   .setDescription('Get a random Okami Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('senko')
   .setDescription('Get a random Senko Image'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('shiro')
   .setDescription('Get a random Shiro Image'),
 );

const roles = new Discord.SlashCommandBuilder()
 .setName('roles')
 .setDescription('Everything about Roles')
 .setDMPermission(false)
 .setDefaultMemberPermissions(Discord.PermissionsBitField.Flags.ManageRoles)
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('builders')
   .setDescription('Different kinds of Role Builders')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('reaction-roles')
     .setDescription('Create a Reaction Role Message')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('message')
       .setDescription('The Message you want to use')
       .setRequired(true),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('button-roles')
     .setDescription('Create a Button Role Message')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('message')
       .setDescription('The Message you want to use')
       .setRequired(true),
     ),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('edit')
   .setDescription('Edit an existing Role')
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role you want to edit')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('name')
     .setDescription('The new Name of the Role')
     .setMaxLength(100)
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('color')
     .setDescription('The new Color of the Role (Hex Code)')
     .setMaxLength(6)
     .setRequired(false),
   )
   .addBooleanOption(
    new Discord.SlashCommandBooleanOption()
     .setName('hoist')
     .setDescription('Whether the Role should be displayed separately')
     .setRequired(false),
   )
   .addAttachmentOption(
    new Discord.SlashCommandAttachmentOption()
     .setName('icon')
     .setDescription('The new Icon of the Role')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('icon-emoji')
     .setDescription('The new Icon of the Role derived from an Emoji')
     .setRequired(false),
   )
   .addBooleanOption(
    new Discord.SlashCommandBooleanOption()
     .setName('mentionable')
     .setDescription('Whether the Role should be mentionable')
     .setRequired(false),
   )
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('position-role')
     .setDescription('The Role to put this Role below')
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('create')
   .setDescription('Create a new Role')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('name')
     .setDescription('The Name of the new Role')
     .setMaxLength(100)
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('color')
     .setDescription('The Color of the new Role (Hex Code)')
     .setMaxLength(6)
     .setRequired(false),
   )
   .addAttachmentOption(
    new Discord.SlashCommandAttachmentOption()
     .setName('icon')
     .setDescription('The new Icon of the Role')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('icon-emoji')
     .setDescription('The new Icon of the Role derived from an Emoji')
     .setRequired(false),
   )
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('position-role')
     .setDescription('The Role to put this Role under')
     .setRequired(false),
   )
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('permission-role')
     .setDescription('The Role to copy the Permissions from')
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('delete')
   .setDescription('Delete a Role')
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role to delete')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('View Information about a Role')
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role to view the Information of')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('members')
   .setDescription('List all Members of a Roles')
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role to view the Members of')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('give')
   .setDescription('Give a Role to a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User to give the Role to')
     .setRequired(true),
   )
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role to give to the User')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('reason')
     .setDescription('The Reason for giving the Role')
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('take')
   .setDescription('Take a Role from a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User to remove the Role from')
     .setRequired(true),
   )
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role to remove from the User')
     .setRequired(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('reason')
     .setDescription('The Reason for giving the Role')
     .setRequired(false),
   ),
 );

const afk = new Discord.SlashCommandBuilder()
 .setName('afk')
 .setDescription('Set your AFK Status')
 .setDMPermission(false)
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('reason')
   .setDescription('The Reason for being AFK')
   .setRequired(false),
 );

const help = new Discord.SlashCommandBuilder()
 .setName('help')
 .setDescription('Get Help for the Bot')
 .setDMPermission(true)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('list')
   .setDescription('See a list of all Commands and Categories'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('command')
   .setDescription('See Help for a specific Command')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('command')
     .setDescription('The Command to see Help for')
     .setRequired(true)
     .setAutocomplete(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('moderation')
   .setDescription('Help for the Moderation Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Help for the Info Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('utility')
   .setDescription('Help for the Utility Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('leveling')
   .setDescription('Help for the Leveling Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('nitro')
   .setDescription('Help for the Nitro Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('vote')
   .setDescription('Help for the Vote Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('roles')
   .setDescription('Help for the Role Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('automation')
   .setDescription('Help for the Automation Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('fun')
   .setDescription('Help for the Fun Commands'),
 );

const emoji = new Discord.SlashCommandBuilder()
 .setName('emojis')
 .setDMPermission(false)
 .setDescription('Detailed Information and Utilities about Emojis')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Information about many Emojis of the Server, or a specific Emoji')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('emoji')
     .setDescription('The Emoji to get Information about')
     .setRequired(false),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('create')
   .setDescription('Create a new Emoji')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-url')
     .setDescription('Create an Emoji from a URL')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('url')
       .setDescription('The URL to create the Emoji from')
       .setRequired(true),
     )
     .addStringOption(EmojiName),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-file')
     .setDescription('Create an Emoji from a File')

     .addAttachmentOption(
      new Discord.SlashCommandAttachmentOption()
       .setName('file')
       .setDescription('The File to create the Emoji from')
       .setRequired(true),
     )
     .addStringOption(EmojiName),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('from-emoji')
     .setDescription('Create an Emoji from another Emoji')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('emoji')
       .setDescription('The Emoji to create the Emoji from')
       .setRequired(true),
     )
     .addStringOption(EmojiName),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('delete')
   .setDescription('Delete an Emoji')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('emoji')
     .setDescription('The Emoji to delete')
     .setRequired(true),
   ),
 )
 .addSubcommandGroup(
  new Discord.SlashCommandSubcommandGroupBuilder()
   .setName('edit')
   .setDescription('Edit an Emoji')
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('name')
     .setDescription('Edit an Emoji')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('emoji')
       .setDescription('The Emoji to edit')
       .setRequired(true),
     )
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('name')
       .setDescription('The new Name of the Emoji')
       .setMaxLength(32)
       .setMinLength(2)
       .setRequired(true),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('roles')
     .setDescription('Edit the Roles that can use an Emoji')
     .addStringOption(
      new Discord.SlashCommandStringOption()
       .setName('emoji')
       .setDescription('The Emoji to edit')
       .setRequired(true),
     ),
   ),
 );

const pardon = new Discord.SlashCommandBuilder()
 .setName('pardon')
 .setDescription('Pardon a Punishment from a User')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .setDMPermission(false)
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
 );

const slowmode = new Discord.SlashCommandBuilder()
 .setName('slowmode')
 .setDescription('Set the Slowmode of a Channel')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
 .setDMPermission(false)
 .addChannelOption(
  new Discord.SlashCommandChannelOption()
   .setName('channel')
   .setDescription('The Channel to set the Slowmode in')
   .setRequired(true)
   .addChannelTypes(...(GuildTextChannelTypes as never[])),
 )
 .addNumberOption(
  new Discord.SlashCommandNumberOption()
   .setName('time')
   .setDescription('The Slowmode in Seconds')
   .setRequired(true)
   .setMaxValue(21600),
 )
 .addStringOption(Reason);

const user = new Discord.SlashCommandBuilder()
 .setName('user')
 .setDMPermission(true)
 .setDescription('Get Information about a User')
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Get Information about a User')
   .addUserOption(User)
   .addStringOption(SearchUsername),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('avatar')
   .setDescription('Get the Avatar of a User')
   .addUserOption(User),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('banner')
   .setDescription('Get the Banner of a User')
   .addUserOption(User),
 );

const vote = new Discord.SlashCommandBuilder()
 .setName('vote')
 .setDescription('Vote for the Bot')
 .setDMPermission(true);

const giveaway = new Discord.SlashCommandBuilder()
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
     .addChannelTypes(...(GuildTextChannelTypes as never[])),
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

export default {
 public: {
  user,
  settings,
  info,
  'embed-builder': embedbuilder,
  check,
  'Stick Message': stickMessage,
  stp,
  membercount,
  ping,
  rp,
  images,
  roles,
  afk,
  help,
  emoji,
  pardon,
  slowmode,
  vote,
  giveaway,
 },
 categories: {
  'settings_moderation_anti-spam': 'moderation',
  'settings_moderation_anti-spam-punishments': 'moderation',
  'settings_moderation_anti-virus': 'moderation',
  'settings_moderation_anti-virus-punishments': 'moderation',
  'settings_moderation_anti-raid': 'moderation',
  'settings_moderation_auto-punish': 'moderation',
  settings_moderation_blacklist: 'moderation',
  'settings_moderation_blacklist-punishments': 'moderation',
  'settings_moderation_blacklist-rules': 'moderation',
  settings_moderation_expiry: 'moderation',
  settings_leveling_basic: 'leveling',
  'settings_leveling_multi-channels': 'leveling',
  'settings_leveling_multi-roles': 'leveling',
  'settings_leveling_level-roles': 'leveling',
  'settings_leveling_rule-channels': 'leveling',
  settings_nitro_basic: 'nitro',
  'settings_nitro_booster-roles': 'nitro',
  settings_vote_basic: 'vote',
  'settings_vote_vote-rewards': 'vote',
  'settings_roles_role-rewards': 'roles',
  'settings_roles_auto-roles': 'roles',
  'settings_roles_self-roles': 'roles',
  settings_roles_separators: 'roles',
  settings_roles_sticky: 'roles',
  'settings_roles_reaction-role-settings': 'roles',
  'settings_roles_reaction-roles': 'roles',
  'settings_roles_button-role-settings': 'roles',
  'settings_roles_button-roles': 'roles',
  'settings_automation_delete-commands': 'automation',
  settings_automation_cooldowns: 'automation',
  'settings_automation_disboard-reminders': 'automation',
  settings_automation_suggestions: 'automation',
  settings_automation_verification: 'automation',
  settings_automation_welcome: 'automation',
  settings_basic: 'utility',
  settings_logs: 'info',
  info_user: 'info',
  info_servers: 'info',
  info_server: 'info',
  info_channel: 'info',
  info_role: 'info',
  info_bot: 'info',
  info_badges: 'info',
  info_emoji: 'info',
  'embed-builder_view_custom-embeds': 'utility',
  'embed-builder_view_from-message': 'utility',
  'embed-builder_create': 'utility',
  check: 'moderation',
  'Stick Message': 'utility',
  stp: 'utility',
  membercount: 'info',
  ping: 'info',
  rp: 'fun',
  images_neko: 'fun',
  images_husbando: 'fun',
  images_kitsune: 'fun',
  images_waifu: 'fun',
  images_shinobu: 'fun',
  images_megumin: 'fun',
  images_eevee: 'fun',
  images_holo: 'fun',
  images_icon: 'fun',
  images_okami: 'fun',
  images_senko: 'fun',
  images_shiro: 'fun',
  'roles_builders_reaction-roles': 'utility',
  'roles_builders_button-roles': 'utility',
  roles_create: 'utility',
  roles_edit: 'utility',
  roles_delete: 'utility',
  roles_info: 'info',
  roles_members: 'info',
  roles_give: 'moderation',
  roles_take: 'moderation',
  afk: 'utility',
  help_list: 'info',
  help_moderation: 'info',
  emoji_info: 'info',
  'emoji_create_from-url': 'utility',
  'emoji_create_from-file': 'utility',
  'emoji_create_from-emoji': 'utility',
  emoji_delete: 'utility',
  emoji_edit_name: 'utility',
  emoji_edit_roles: 'utility',
  pardon_one: 'moderation',
  pardon_before: 'moderation',
  pardon_after: 'moderation',
  pardon_between: 'moderation',
  pardon_by: 'moderation',
  'pardon_all-by': 'moderation',
  'pardon_all-on': 'moderation',
  slowmode: 'utility',
  user_info: 'info',
  user_avatar: 'utility',
  user_banner: 'utility',
  vote: 'info',
  giveaway_create: 'utility',
  giveaway_reroll: 'utility',
  giveaway_cancel: 'utility',
  giveaway_list: 'info',
  giveaway_end: 'utility',
 },
};
