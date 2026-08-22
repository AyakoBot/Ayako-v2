import * as Discord from 'discord.js';
import { EmbedFields } from '../../../../../BaseClient/Other/constants/customEmbeds.js';
import { getSelectedField } from '../../../../ButtonCommands/embed-builder/deleteCustom.js';
import startOver from '../../../../ButtonCommands/embed-builder/startOver.js';

import boolean from './boolean.js';
import hex from './hex.js';
import img from './img.js';
import link from './link.js';
import string from './string.js';
import timestamp from './timestamp.js';

const editors = {
 string,
 hex,
 img,
 link,
 timestamp,
 boolean,
};

export default (cmd: Discord.StringSelectMenuInteraction) => {
 const args = cmd.values[0].split(/_+/g);

 if (args[0] === 'remove-field') {
  const selectedField = getSelectedField(cmd.message);

  const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data);
  if (!embed.data.fields?.length) return;
  embed.data.fields.splice(Number(selectedField), 1);

  startOver(cmd, [], embed.data);
  return;
 }

 const editor = editors[args[0] as keyof typeof editors];
 if (!editor) return;

 editor(cmd, [args[1] as EmbedFields]);
};
