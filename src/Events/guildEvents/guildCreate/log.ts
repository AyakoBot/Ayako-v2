import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (guild: DDeno.Guild) => {
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
              value: guild.name,
            },
            { name: 'Guild ID', value: String(guild.id) },
            { name: 'Membercount', value: String(guild.memberCount) },
            { name: 'Guild Owner ID', value: String(guild.ownerId) },
          ],
        },
      ],
    },
    (await import('../../../Languages/en.js')).default,
  );
};
