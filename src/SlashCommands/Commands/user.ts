import * as Discord from 'discord.js';

const User = new Discord.SlashCommandUserOption()
 .setName('user')
 .setDescription('The User')
 .setRequired(false);

export default new Discord.SlashCommandBuilder()
 .setName('user')
 .setDescription('Get Information about a User')
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
   .setName('info')
   .setDescription('Get Information about a User')
   .addUserOption(User)
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
