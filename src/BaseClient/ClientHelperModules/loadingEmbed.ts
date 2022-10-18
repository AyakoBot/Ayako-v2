import type * as DDeno from 'discordeno';
import client from '../DDenoClient';
import colorSelector from './colorSelector';

export default async (
  guild: DDeno.Guild,
  {
    lan,
    language,
  }: {
    language: typeof import('../../Languages/en.json');
    lan: { author: string; loading?: string };
  },
) => {
  const member = await client.helpers.getMember(guild.id, client.id);

  const embed: DDeno.Embed = {
    type: 'rich',
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
