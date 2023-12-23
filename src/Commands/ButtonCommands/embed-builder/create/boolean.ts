import * as Discord from 'discord.js';
import { getSelectedField } from '../../../ModalCommands/embed-builder/editor.js';
import startOver from '../startOver.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data);
 if (!embed.data.fields) return;

 const selectedField = getSelectedField(cmd);

 const field = embed.data.fields[Number(selectedField)];
 field.inline = !field.inline;

 startOver(cmd, [], embed.data, Number(selectedField));
};
