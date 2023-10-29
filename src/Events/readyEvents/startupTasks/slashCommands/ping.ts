import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

const name = client.user?.username;

export default new Discord.SlashCommandBuilder()
 .setName('ping')
 .setDescription(`Display the ${name}'s Ping`)
 .setDMPermission(true);
