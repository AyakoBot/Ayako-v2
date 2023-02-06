import * as Discord from 'discord.js';

// Commands

const settings = new Discord.SlashCommandBuilder()
  .setName('settings')
  .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
  .setDescription("Manage Ayako's Settings")
  .setDMPermission(false)
  .addSubcommandGroup(
    new Discord.SlashCommandSubcommandGroupBuilder()
      .setName('moderation')
      .setDescription("Everthing about Ayako's Moderation")
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
          .setDescription('Help Moderators punish consistently'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('blacklist')
          .setDescription('Stop Members from using specific Words or Phrases'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('expiry')
          .setDescription('Define when logged Punishments expire'),
      ),
  )
  .addSubcommandGroup(
    new Discord.SlashCommandSubcommandGroupBuilder()
      .setName('automation')
      .setDescription("Everthing about Ayako's Automation")
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('auto-role')
          .setDescription('Assign Roles to Users and Bots when joining'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('cooldowns')
          .setDescription('Assign custom defined Cooldowns to Commands of Ayako'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('disboard')
          .setDescription('Have a Bump reminder remind your Members to bump your Server'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('logs')
          .setDescription('Log Changes to any Part of your Server'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('self-roles')
          .setDescription('Let Members pick their own Roles'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('separators')
          .setDescription('Separate Roles into Categories using Category Roles / Role Separators'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('sticky')
          .setDescription('Make Roles and Channel Permissions stick to Members across re-joins'),
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
          .setName('leveling')
          .setDescription('Reward Members for their activity with Server Levels'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('nitro-monitoring')
          .setDescription('Reward Boosters with Roles for consistent Boosting or other Rewards'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('reaction-roles')
          .setDescription('Let Members pick their own Roles through Reactions'),
      )
      .addSubcommand(
        new Discord.SlashCommandSubcommandBuilder()
          .setName('button-roles')
          .setDescription('Let Members pick their own Roles through Buttons'),
      ),
  )
  .addSubcommand(
    new Discord.SlashCommandSubcommandBuilder()
      .setName('basic')
      .setDescription("Basic Settings to modify Ayako's behaviour"),
  );

export default { public: { settings } };
