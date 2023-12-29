import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/Typings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (guild: Discord.Guild | undefined) => {
 const webhook = await client.fetchWebhook(
  process.env.guildActionWebhookID ?? '',
  process.env.guildActionWebhookToken ?? '',
 );

 const totalguildcount =
  ((await client.shard?.fetchClientValues('guilds.cache.size')) as number[] | undefined)?.reduce(
   (acc, count) => acc + count,
   0,
  ) ?? 0;

 webhook?.send({
  embeds: [
   {
    color: CT.Colors.Danger,
    description: '<@&669894051851403294> joined a new Guild',
    fields: [
     { name: 'Guild Name', value: guild?.name || 'Unknown/Uncached', inline: true },
     { name: 'Guild ID', value: String(guild?.id) || 'Unknown/Uncached', inline: true },
     { name: 'Membercount', value: String(guild?.memberCount) || 'Unknown/Uncached', inline: true },
     { name: 'Guild Owner ID', value: String(guild?.ownerId) || 'Unknown/Uncached', inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: {
     text: `Total Guilds: ${ch.splitByThousand(totalguildcount)}`,
    },
   },
  ],
 });
};
