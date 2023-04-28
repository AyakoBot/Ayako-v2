import * as Discord from 'discord.js';
import startOver from '../startOver.js';
import { getSelectedField } from '../../../ModalCommands/embed-builder/editor.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const selectedField = getSelectedField(cmd);

 const embed = new Discord.EmbedBuilder(cmd.message.embeds[0].data);
 if (!embed.data.fields?.length) return;
 embed.data.fields.splice(Number(selectedField), 1);

 startOver(cmd, [], embed.data, Number(selectedField));
};
