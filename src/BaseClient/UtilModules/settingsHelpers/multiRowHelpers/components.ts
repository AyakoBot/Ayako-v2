import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

/**
 * Adds pagination buttons to the beginning of the components array
 * if the number of fields exceeds 25.
 * @param embeds - The array of embeds to check.
 * @param components - The array of action row components to add the pagination buttons to.
 * @param language - The language object containing the button text.
 * @param name - The name of the setting being paginated.
 */
export default <T extends keyof typeof S.SettingsName2TableName>(
 embeds: Discord.APIEmbed[],
 components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[],
 language: CT.Language,
 name: T,
) => {
 if (Number(embeds[0].fields?.length) > 25) {
  components.unshift({
   type: Discord.ComponentType.ActionRow,
   components: [
    language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.buttonParsers.previous.file.default(
     language,
     name,
    ),
    language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.buttonParsers.next.file.default(
     language,
     name,
     undefined,
     true,
    ),
   ],
  });
 }
};
