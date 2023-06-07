import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import auth from '../../../auth.json' assert { type: 'json' };
import client from '../../../BaseClient/Client.js';

export default async (guild: Discord.Guild | undefined) => {
 const webhook = await client.fetchWebhook(
  auth.guildActionWebhook.id,
  auth.guildActionWebhook.token,
 );

 webhook?.send({
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
    timestamp: new Date().toISOString(),
   },
  ],
 });
};
