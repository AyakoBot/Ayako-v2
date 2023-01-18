import type DDeno from 'discordeno';
import stp from './stp.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (rawEmbed: DDeno.Embed, options: ((string | any)[] | (string | any)[])[]) => {
  const embeds = [rawEmbed];

  options.forEach((option) => {
    const embedToUse = embeds[embeds.length - 1];

    const embed: DDeno.Embed = { type: 'rich' };

    embed.color = embedToUse.color;
    embed.title = embedToUse.title ? stp(embedToUse.title, { [option[0]]: option[1] }) : undefined;
    embed.url = embedToUse.url ? stp(embedToUse.url, { [option[0]]: option[1] }) : undefined;

    if (embedToUse.author) {
      embed.author = {
        name: embedToUse.author.name
          ? stp(embedToUse.author.name, { [option[0]]: option[1] })
          : '\u200b',
        iconUrl: embedToUse.author.iconUrl
          ? stp(embedToUse.author.iconUrl, { [option[0]]: option[1] })
          : undefined,
        url: embedToUse.author.url
          ? stp(embedToUse.author.url, { [option[0]]: option[1] })
          : undefined,
      };
    }

    embed.description = embedToUse.description
      ? stp(embedToUse.description, { [option[0]]: option[1] })
      : undefined;

    embed.thumbnail =
      embedToUse.thumbnail && embedToUse.thumbnail.url
        ? { url: stp(embedToUse.thumbnail.url, { [option[0]]: option[1] }) }
        : undefined;

    if (embedToUse.image && embedToUse.image.url) {
      embed.image = {
        url: stp(embedToUse.image.url, { [option[0]]: option[1] }),
      };
    }

    embed.timestamp = embedToUse.timestamp
      ? Number(stp(`${embedToUse.timestamp}`, { [option[0]]: option[1] }))
      : undefined;

    if (embedToUse.footer) {
      embed.footer = {
        text: embedToUse.footer.text
          ? stp(embedToUse.footer.text, { [option[0]]: option[1] })
          : '\u200b',
        iconUrl: embedToUse.footer.iconUrl
          ? stp(embedToUse.footer.iconUrl, { [option[0]]: option[1] })
          : undefined,
      };
    }

    if (embedToUse.fields && embedToUse.fields.length) {
      embedToUse.fields.forEach((field) => {
        if (!embed.fields) embed.fields = [];

        embed.fields.push({
          name: field.name ? stp(field.name, { [option[0]]: option[1] }) : '\u200b',
          value: field.value ? stp(field.value, { [option[0]]: option[1] }) : '\u200b',
          inline: field.inline,
        });
      });
    }

    embeds.push(embed);
  });

  return embeds.pop();
};
