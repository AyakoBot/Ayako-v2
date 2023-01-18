import type * as Discord from 'discord.js';
import client from '../Client.js';
import colorSelector from './colorSelector.js';
import type CT from '../../Typings/CustomTypings';

export default async (
  guild: DDeno.Guild,
  {
    lan,
    language,
  }: {
    language: CT.Language;
    lan: { author: string; loading?: string };
  },
) => {
  const member = await client.helpers.getMember(guild.id, client.id);

  const embed: DDeno.Embed = {
    author: {
      name: lan.author,
      iconUrl: client.objectEmotes.loading.link,
      url: client.customConstants.standard.invite,
    },
    color: await colorSelector(member),
    description: `${client.stringEmotes.loading} ${lan.loading ? lan.loading : language.loading}`,
  };
  return embed;
};
