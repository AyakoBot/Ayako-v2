import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const selectedField =
  cmd.client.util.importCache.Commands.ModalCommands['embed-builder'].editor.file.getSelectedField(
   cmd,
  );

 const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data);
 if (!embed.data.fields?.length) return;
 embed.data.fields.splice(Number(selectedField), 1);

 cmd.client.util.importCache.Commands.ButtonCommands['embed-builder'].startOver.file.default(
  cmd,
  [],
  embed.data,
  Number(selectedField),
 );
};
