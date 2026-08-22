import type * as Discord from 'discord.js';
import startOver from '../../../../ButtonCommands/embed-builder/startOver.js';
import { getSelectedField } from '../../../../ButtonCommands/embed-builder/deleteCustom.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 const selectedField = getSelectedField(cmd.message);
 const embed = structuredClone(cmd.message.embeds[1].data) as Discord.APIEmbed;
 embed.fields![selectedField].inline = !embed.fields![selectedField].inline;

 await startOver(cmd, [], embed, typeof selectedField === 'number' ? Number(selectedField) : null);
};
