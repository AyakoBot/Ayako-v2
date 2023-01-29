import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (_: bigint, guild: Discord.Guild | undefined) => {
  client.ch.send(
    { id: '718181439354437693', guildId: '669893888856817665' },
    {
      embeds: [
        {
          color: client.customConstants.colors.danger,
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
