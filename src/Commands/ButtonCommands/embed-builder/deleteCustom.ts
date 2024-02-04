import type * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const selectedOption = getSelectedField(cmd)?.value;
 if (!selectedOption) return;

 await cmd.client.util.DataBase.customembeds.delete({ where: { uniquetimestamp: selectedOption } });

 cmd.client.util.importCache.Commands.SlashCommands['embed-builder'].create.file.default(cmd);
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
