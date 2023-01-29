import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (msg: CT.DMMessage) => {
  if (msg.author.id === client.user?.id) return;

  const embed: Discord.APIEmbed = {
    color: client.customConstants.colors.base,
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

  client.ch.send(
    { id: '825297763822469140', guildId: '669893888856817665' },
    {
      embeds: [embed],
    },
    msg.language,
  );
};
