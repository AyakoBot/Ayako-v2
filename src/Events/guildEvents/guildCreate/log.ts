import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/Typings.js';

export default async (guild: Discord.Guild) => {
 const webhook = await client.fetchWebhook(
  process.env.guildActionWebhookID ?? '',
  process.env.guildActionWebhookToken ?? '',
 );

 webhook?.send({
  embeds: [
   {
    color: CT.Colors.Success,
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
    timestamp: new Date().toISOString(),
   },
  ],
 });
};
