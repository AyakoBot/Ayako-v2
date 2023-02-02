import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (sticker: Discord.Sticker) => {
  if (!sticker.guild) return;

  const channels = await client.ch.getLogChannels('stickerevents', sticker.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(sticker.guild.id);
  const lan = language.events.logs.sticker;
  const con = client.customConstants.events.logs.sticker;
  const audit = (await client.ch.getAudit(sticker.guild, 92, sticker.id)) ?? undefined;
  const auditUser = audit?.executor ?? (await sticker.fetchUser());
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.delete,
      name: lan.nameDelete,
    },
    description: auditUser ? lan.descDeleteAudit(sticker, auditUser) : lan.descDelete(sticker),
    fields: [],
    color: client.customConstants.colors.danger,
  };

  const attachment = (await client.ch.fileURL2Buffer([sticker.url]))?.[0];
  if (attachment) {
    files.push(attachment);

    embed.thumbnail = {
      url: `attachment://${client.ch.getNameAndFileType(sticker.url)}`,
    };
  }

  if (sticker.description) {
    embed.fields?.push({
      name: lan.description,
      value: sticker.description,
    });
  }

  if (sticker.tags) {
    embed.fields?.push({
      name: lan.tags,
      value: `:${sticker.tags}:`,
    });
  }

  embed.fields?.push({
    name: lan.formatName,
    value: lan.format[sticker.format],
  });

  client.ch.send(
    { id: channels, guildId: sticker.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
