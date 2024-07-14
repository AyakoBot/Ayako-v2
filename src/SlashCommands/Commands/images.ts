import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('images')
 .setDescription('Get a random Image')
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
