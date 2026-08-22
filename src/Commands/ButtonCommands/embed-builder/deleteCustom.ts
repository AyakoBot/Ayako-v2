import type * as Discord from 'discord.js';
import { buildEmbed } from '../../SlashCommands/embed-builder/create.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 await cmd.client.util.DataBase.customembeds.delete({
  where: { uniquetimestamp: getSelectedField(cmd.message) },
 });

 buildEmbed(cmd);
};

export const getSelectedField = (msg: Discord.Message) =>
 Number(
  (
   (msg.components[1] as Discord.ActionRow<Discord.MessageActionRowComponent>)
    .components[0] as Discord.StringSelectMenuComponent
  ).data.options.find((o) => !!o.default)?.value,
 );
