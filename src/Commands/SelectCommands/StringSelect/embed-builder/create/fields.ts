import * as Discord from 'discord.js';
import startOver from '../../../../ButtonCommands/embed-builder/startOver.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 const name = cmd.values[0];
 const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data);
 let selected = embed.data.fields?.length ?? 0;

 switch (name) {
  case 'create': {
   embed.addFields({ name: '\u200b', value: '\u200b', inline: true });
   break;
  }
  default: {
   selected = Number(name);
  }
 }

 startOver(cmd, [], embed.data, selected);
};
