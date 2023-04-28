import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { buildEmbed } from '../../SlashCommands/embed-builder/create.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const selectedOption = getSelectedField(cmd)?.value;
 if (!selectedOption) return;

 await ch.query(`DELETE FROM customembeds WHERE uniquetimestamp = $1;`, [selectedOption]);

 buildEmbed(cmd);
};

export const getSelectedField = (
 cmd:
  | Discord.ModalMessageModalSubmitInteraction
  | Discord.StringSelectMenuInteraction
  | Discord.ButtonInteraction,
) =>
 (cmd.message.components[2].components[0] as Discord.StringSelectMenuComponent).data.options.find(
  (o) => !!o.default,
 );
