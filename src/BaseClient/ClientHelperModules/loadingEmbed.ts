import type * as Discord from 'discord.js';
import client from '../Client.js';
import colorSelector from './colorSelector.js';
import type CT from '../../Typings/CustomTypings';

export default (
  guild: Discord.Guild,
  {
    lan,
    language,
  }: {
    language: CT.Language;
    lan: { author: string; loading?: string };
  },
): Discord.APIEmbed => ({
  author: {
    name: lan.author,
    icon_url: client.objectEmotes.loading.link,
    url: client.customConstants.standard.invite,
  },
  color: colorSelector(guild.members.me ?? undefined),
  description: `${client.stringEmotes.loading} ${lan.loading ? lan.loading : language.loading}`,
});
