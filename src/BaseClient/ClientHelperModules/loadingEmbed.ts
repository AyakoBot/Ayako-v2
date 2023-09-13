import type * as Discord from 'discord.js';
import stringEmotes from './stringEmotes.js';
import objectEmotes from './objectEmotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings.js';

export default ({
 lan,
 language,
}: {
 language: CT.Language;
 lan: { author: string; loading?: string };
}): Discord.APIEmbed => ({
 author: {
  name: lan.author,
  icon_url: objectEmotes.loading.link,
  url: constants.standard.invite,
 },
 color: constants.colors.loading,
 description: `${stringEmotes.loading} ${lan.loading ? lan.loading : language.loading}`,
});
