import type * as Discord from 'discord.js';
import emotes from './emotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings.js';

/**
 * Returns a Discord API Embed object for a loading message.
 * @param {Object} options - The options object.
 * @param {CT.Language} options.language - The language object.
 * @param {Object} options.lan - The language-specific options object.
 * @param {string} options.lan.author - The author of the loading message.
 * @param {string} [options.lan.loading] - The loading message to display.
 * @returns {Discord.APIEmbed} - The Discord API Embed object.
 */
export default ({
 lan,
 language,
}: {
 language: CT.Language;
 lan: { author: string; loading?: string };
}): Discord.APIEmbed => ({
 author: {
  name: lan.author,
  icon_url: emotes.loading.link,
  url: constants.standard.invite,
 },
 color: constants.colors.loading,
 description: `${constants.standard.getEmote(emotes.loading)} ${
  lan.loading ? lan.loading : language.loading
 }`,
});
