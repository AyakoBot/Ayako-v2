import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

const name = client.user?.username;

export default new Discord.SlashCommandBuilder()
 .setName('check')
 .setDescription('View all Punishments of a User')
 .setDMPermission(false)
 .addUserOption(
  new Discord.SlashCommandUserOption()
   .setName('user')
   .setDescription('The User')
   .setRequired(false),
 )
 .addStringOption(
  new Discord.SlashCommandStringOption()
   .setName('user-name')
   .setDescription(`Username of the User (Searches across all of ${name}'s Servers)`)
   .setRequired(false)
   .setMinLength(2)
   .setAutocomplete(true),
 );
