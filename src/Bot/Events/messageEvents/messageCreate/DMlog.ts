import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msg: CT.MessageDM) => {
  if (msg.authorId === client.id) return;
  const embed = {
    color: client.customConstants.standard.color,
    description: `${msg.author} / ${msg.author.id}\n${msg.content}`,
    fields: [
      {
        name: '\u200b',
        value: msg.jumpLink,
      },
    ],
  };

  for (let i = 0; i < msg.attachments.length; i += 1) {
    embed.fields.push({ name: '\u200b', value: msg.attachments[i].url });
  }

  for (let i = 0; i < msg.embeds.length; i += 1) {
    const thisEmbed = msg.embeds[i];
    let text = 'none';
    if (thisEmbed.title) text = thisEmbed.title;
    else if (thisEmbed.author) text = thisEmbed.author?.name;

    embed.fields.push({ name: '\u200b', value: text });
  }

  const channel = await client.cache.channels.get(825297763822469140n, 669893888856817665n);
  if (!channel) return;

  client.ch.send(
    channel,
    {
      embeds: [embed],
    },
    msg.language,
  );
};
