import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import auth from '../../../auth.json' assert { type: 'json' };

export default async (msg: Discord.Message) => {
  if (msg.author.id === client.user?.id) return;

  const embed: Discord.APIEmbed = {
    color: ch.constants.colors.base,
    description: `${msg.author} / ${msg.author.id}\n${msg.content}`,
    fields: [
      {
        name: '\u200b',
        value: msg.url,
      },
    ],
  };

  msg.attachments.forEach((attachment) =>
    embed.fields?.push({ name: '\u200b', value: attachment.url }),
  );

  for (let i = 0; i < msg.embeds.length; i += 1) {
    const thisEmbed = msg.embeds[i];
    let text = 'none';
    if (thisEmbed.title) text = thisEmbed.title;
    else if (thisEmbed.author) text = thisEmbed.author?.name;

    embed.fields?.push({ name: '\u200b', value: text });
  }

  const webhook = await client.fetchWebhook(auth.dmWebhook.id, auth.dmWebhook.token);

  webhook?.send({
    embeds: [embed],
  });
};
