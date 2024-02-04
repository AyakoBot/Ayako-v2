import type * as Discord from 'discord.js';

export default async (guild: Discord.Guild) => {
 const webhook = await guild.client.fetchWebhook(
  process.env.guildActionWebhookID ?? '',
  process.env.guildActionWebhookToken ?? '',
 );

 const totalguildcount =
  (
   (await guild.client.cluster?.fetchClientValues('guilds.cache.size')) as number[] | undefined
  )?.reduce((acc, count) => acc + count, 0) ?? 0;

 webhook?.send({
  embeds: [
   {
    color: guild.client.util.CT.Colors.Success,
    description: '<@&669894051851403294> joined a new Guild',
    fields: [
     { name: 'Guild Name', value: guild.name, inline: true },
     { name: 'Guild ID', value: String(guild.id), inline: true },
     { name: 'Membercount', value: String(guild.memberCount), inline: true },
     { name: 'Guild Owner ID', value: String(guild.ownerId), inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: {
     text: `Total Guilds: ${guild.client.util.splitByThousand(totalguildcount)}`,
    },
   },
  ],
 });
};
