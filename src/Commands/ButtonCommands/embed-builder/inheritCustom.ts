import type * as Discord from 'discord.js';
import { getSelectedField } from './deleteCustom.js';
import startOver from './startOver.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const dbEmbed = await cmd.client.util.DataBase.customembeds.findUnique({
  where: { uniquetimestamp: getSelectedField(cmd.message) },
 });
 if (!dbEmbed) return;

 const embed = cmd.client.util.getDiscordEmbed(dbEmbed);

 startOver(cmd, [], embed);
};
