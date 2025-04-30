import {
 SlashCommandBuilder,
 SlashCommandSubcommandBuilder,
 SlashCommandUserOption,
} from '@discordjs/builders';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

export default new SlashCommandBuilder()
 .setName('rp')
 .setDescription('Allows Admins to manage RP-Commands and Users to block others')
 .setContexts([
  InteractionContextType.BotDM,
  InteractionContextType.Guild,
  InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  ApplicationIntegrationType.GuildInstall,
  ApplicationIntegrationType.UserInstall,
 ])
 .addSubcommand(
  new SlashCommandSubcommandBuilder().setName('manager').setDescription('Manage RP-Commands'),
 )
 .addSubcommand(
  new SlashCommandSubcommandBuilder()
   .setName('blocked')
   .setDescription('See Commands and Users you currently have blocked'),
 )
 .addSubcommand(
  new SlashCommandSubcommandBuilder()
   .setName('block')
   .setDescription('Block a Command or a User from using RP-Commands on you')
   .addUserOption(
    new SlashCommandUserOption().setName('user').setDescription('The User').setRequired(false),
   ),
 )
 .addSubcommand(
  new SlashCommandSubcommandBuilder()
   .setName('unblock')
   .setDescription('Unblock a Command or a User from using RP-Commands on you')
   .addUserOption(
    new SlashCommandUserOption().setName('user').setDescription('The User').setRequired(true),
   ),
 );
