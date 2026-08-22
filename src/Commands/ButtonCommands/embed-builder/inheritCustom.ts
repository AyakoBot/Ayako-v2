import type * as Discord from 'discord.js';
import { getSelectedField } from './deleteCustom.js';
import startOver from './startOver.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const dbEmbed = await cmd.client.util.DataBase.customembeds.findUnique({
  where: { uniquetimestamp: getSelectedField(cmd.message) },
 });
 if (!dbEmbed) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 await cmd.update({
  embeds: [
   cmd.client.util.loadingEmbed({
    language,
    lan: { author: language.t.loading },
   }),
  ],
  components: [],
 });

 const embed = cmd.client.util.getDiscordEmbed(dbEmbed);

 startOver(cmd, [], embed);
};
