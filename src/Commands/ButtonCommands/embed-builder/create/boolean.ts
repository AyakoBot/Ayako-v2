import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data);
 if (!embed.data.fields) return;

 const selectedField =
  cmd.client.util.importCache.Commands.ModalCommands['embed-builder'].editor.file.getSelectedField(
   cmd,
  );

 const field = embed.data.fields[Number(selectedField)];
 field.inline = !field.inline;

 cmd.client.util.importCache.Commands.ButtonCommands['embed-builder'].startOver.file.default(
  cmd,
  [],
  embed.data,
  Number(selectedField),
 );
};
