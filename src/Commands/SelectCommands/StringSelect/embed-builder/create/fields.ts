import * as Discord from 'discord.js';

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

 cmd.client.util.importCache.Commands.ButtonCommands['embed-builder'].startOver.file.default(
  cmd,
  [],
  embed.data,
  selected,
 );
};
