import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { buildEmbed } from '../../SlashCommands/embed-builder/create.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const selectedOption = getSelectedField(cmd)?.value;
 if (!selectedOption) return;

 await ch.DataBase.customembeds.delete({ where: { uniquetimestamp: selectedOption } });

 buildEmbed(cmd);
};

export const getSelectedField = (
 cmd:
  | Discord.ModalMessageModalSubmitInteraction
  | Discord.StringSelectMenuInteraction
  | Discord.ButtonInteraction,
) =>
 (cmd.message.components[1].components[0] as Discord.StringSelectMenuComponent).data.options.find(
  (o) => !!o.default,
 );
