import type * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';

export default async (guild: Discord.Guild | undefined) => {
  ch.send(
    { id: '718181439354437693', guildId: '669893888856817665' },
    {
      embeds: [
        {
          color: ch.constants.colors.danger,
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
  );
};
