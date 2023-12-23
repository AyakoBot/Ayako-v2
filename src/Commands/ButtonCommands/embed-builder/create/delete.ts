import * as Discord from 'discord.js';
import { getSelectedField } from '../../../ModalCommands/embed-builder/editor.js';
import startOver from '../startOver.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const selectedField = getSelectedField(cmd);

 const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data);
 if (!embed.data.fields?.length) return;
 embed.data.fields.splice(Number(selectedField), 1);

 startOver(cmd, [], embed.data, Number(selectedField));
};
