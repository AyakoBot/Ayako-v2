import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/Typings.js';
import auth from '../../../auth.json' assert { type: 'json' };

export default async (guild: Discord.Guild | undefined) => {
 const webhook = await client.fetchWebhook(
  auth.guildActionWebhook.id,
  auth.guildActionWebhook.token,
 );

 webhook?.send({
  embeds: [
   {
    color: CT.Colors.Danger,
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
