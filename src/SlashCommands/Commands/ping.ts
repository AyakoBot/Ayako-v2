import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('ping')
 .setDescription(`Display the ${process.env.mainName}'s Ping`)
 .setDMPermission(true);
