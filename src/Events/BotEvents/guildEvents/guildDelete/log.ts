import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (guild: Discord.Guild | undefined) => {
 if (!guild) return;

 const webhook = await client.fetchWebhook(
  process.env.guildActionWebhookID ?? '',
  process.env.guildActionWebhookToken ?? '',
 );

 const totalguildcount =
  ((await client.cluster?.fetchClientValues('guilds.cache.size')) as number[] | undefined)?.reduce(
   (acc, count) => acc + count,
   0,
  ) ?? 0;

 const payload = {
  embeds: [
   {
    color: CT.Colors.Danger,
    description: '<@&669894051851403294> left a Guild',
    fields: [
     { name: 'Guild Name', value: guild?.name || 'Unknown/Uncached', inline: true },
     { name: 'Guild ID', value: String(guild?.id), inline: true },
     { name: 'Membercount', value: String(guild?.memberCount), inline: true },
     { name: 'Guild Owner ID', value: String(guild?.ownerId), inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: {
     text: `Total Guilds: ${client.util.splitByThousand(totalguildcount)}`,
    },
   },
  ],
 };

 if (['Unknown/Uncached', 'undefined'].includes(payload.embeds[0].fields[2].value)) return;

 webhook?.send(payload);
};
