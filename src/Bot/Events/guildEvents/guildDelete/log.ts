import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (_: bigint, guild: DDeno.Guild | undefined) => {
  client.ch.send(
    { id: 718181439354437693n, guildId: 669893888856817665n },
    {
      embeds: [
        {
          color: client.customConstants.colors.success,
          description: '<@&669894051851403294> joined a new Guild',
          fields: [
            {
              name: 'Guild Name',
              value: guild?.name || 'Unknown/Uncached',
            },
            { name: 'Guild ID', value: String(guild?.id) || 'Unknown/Uncached' },
            { name: 'Membercount', value: String(guild?.memberCount) || 'Unknown/Uncached' },
            { name: 'Guild Owner ID', value: String(guild?.ownerId) || 'Unknown/Uncached' },
          ],
        },
      ],
    },
    (await import('../../../Languages/en.js')).default,
  );
};
