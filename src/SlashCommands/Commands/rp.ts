import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('rp')
 .setDescription('Allows Admins to manage RP-Commands and Users to block others')
 .setContexts([
  Discord.InteractionContextType.BotDM,
  Discord.InteractionContextType.Guild,
  Discord.InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  Discord.ApplicationIntegrationType.GuildInstall,
  Discord.ApplicationIntegrationType.UserInstall,
 ])
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('manager')
   .setDescription('Manage RP-Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('blocked')
   .setDescription('See Commands and Users you currently have blocked'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('block')
   .setDescription('Block a Command or a User from using RP-Commands on you')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unblock')
   .setDescription('Unblock a Command or a User from using RP-Commands on you')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   ),
 );
