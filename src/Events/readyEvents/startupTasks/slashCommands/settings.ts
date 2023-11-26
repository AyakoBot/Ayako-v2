import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

const name = client.user?.username;

const IDSelector = new Discord.SlashCommandStringOption()
 .setAutocomplete(true)
 .setDescription('The ID of the Setting')
 .setRequired(false)
 .setName('id');

export default new Discord.SlashCommandBuilder()
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
     .setName('anti-virus')
     .setDescription('Stop Members from posting harmful Links'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('auto-punish')
     .setDescription('Help Moderators punish consistently')
     .addStringOption(IDSelector),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('newlines')
     .setDescription('Limit the Amount of Newlines a Message can contain'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('invites')
     .setDescription('Stop Members from sending Invites'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('denylist-rules')
     .setDescription('The Rules of the Denylist')
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
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('reset-all')
     .setDescription('Reset all Levels of all Members'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('reset-user')
     .setDescription('Reset Levels for a User')
     .addUserOption(
      new Discord.SlashCommandUserOption()
       .setName('user')
       .setDescription('The User to reset Levels on')
       .setRequired(true),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('reset-role')
     .setDescription('Reset Levels for all Members of a Role')
     .addRoleOption(
      new Discord.SlashCommandRoleOption()
       .setName('role')
       .setDescription('The Role of Users to reset Levels on')
       .setRequired(true),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('set-level-user')
     .setDescription('Set Levels for a User')
     .addUserOption(
      new Discord.SlashCommandUserOption()
       .setName('user')
       .setDescription('The User to set Levels on')
       .setRequired(true),
     ),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('set-level-role')
     .setDescription('Set Levels for all Members of a Role')
     .addRoleOption(
      new Discord.SlashCommandRoleOption()
       .setName('role')
       .setDescription('The Role of Users to set Levels on')
       .setRequired(true),
     ),
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
     .setName('shop')
     .setDescription('Create a Server-Shop Members can buy Roles in using their Server-Currency'),
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('shop-items')
     .setDescription('The Roles you can buy in the Server-Shop')
     .addStringOption(IDSelector),
   )
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
     .setName('censor')
     .setDescription('Repost Messages that contain Denylisted Words'),
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
   )
   .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
     .setName('voice-hub')
     .setDescription('Have Ayako create Voice Channels for your Members')
     .addStringOption(IDSelector),
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
