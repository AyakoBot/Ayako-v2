import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

const name = client.user?.username;

const User = new Discord.SlashCommandUserOption()
 .setName('user')
 .setDescription('The User')
 .setRequired(false);

export default new Discord.SlashCommandBuilder()
 .setName('user')
 .setDMPermission(true)
 .setDescription('Get Information about a User')
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Get Information about a User')
   .addUserOption(User)
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('user-name')
     .setDescription(`Username of the User (Searches across all of ${name}'s Servers)`)
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
