import type DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';
import type CT from '../../../Typings/CustomTypings';

export default async (msg: CT.MessageGuild) => {
  const channels = await client.ch.getLogChannels('messageevents', msg);
  if (!channels) return;

  const lan = msg.language.events.messageDelete;
  const con = client.customConstants.events.logs.message;

  const audit = await client.ch.getAudit(
    msg.guild,
    72,
    msg.authorId,
    (a) => a.options?.channelId === msg.channelId,
  );
  const getEmbedWithEntry = async () => {
    if (!audit?.userId) return null;
    const executor = await client.cache.users.get(audit.userId);

    const embed: DDeno.Embed = {
      author: {
        name: lan.title,
        iconUrl: con.delete,
      },
      description: lan.descDetails(msg.channel, msg.author, executor),
      color: client.customConstants.colors.warning,
      fields: [],
    };

    if (audit?.reason) {
      embed.fields?.push({ name: msg.language.reason, value: audit.reason });
    }

    return embed;
  };

  const getEmbedWithoutEntry = () => {
    const embed: DDeno.Embed = {
      author: {
        name: lan.title,
        iconUrl: con.delete,
      },
      description: lan.desc(msg.author, msg.channel),
      color: client.customConstants.colors.warning,
      fields: [],
    };

    return embed;
  };

  const maxFieldSize = 1024;
  const embed = audit ? await getEmbedWithEntry() : getEmbedWithoutEntry();
  if (!embed) return;

  const getContentFields = () => {
    if (!msg.content?.length) return;
    if (msg.content.length <= maxFieldSize) {
      embed.fields?.push({ name: msg.language.content, value: msg.content });
      return;
    }

    const chunks: string[] = [];

    let content = String(msg.content);
    while (content.length > maxFieldSize) {
      const chunk = content.slice(0, maxFieldSize);
      chunks.push(chunk);
      content = content.slice(maxFieldSize);
    }
    const chunk = content.slice(0, maxFieldSize);
    chunks.push(chunk);

    chunks.forEach((c) => {
      embed.fields?.push({ name: '\u200b', value: c });
    });
  };

  getContentFields();

  const getBuffers = async () => {
    if (!msg.attachments?.length) return [];
    const attachments = await client.ch.fileURL2Buffer(msg.attachments.map((a) => a.url));
    return attachments;
  };

  const files: DDeno.FileContent[] = [];
  const secondMessageFiles = await getBuffers();

  let embedCodes = null;

  if (msg.embeds?.length) {
    embedCodes = `${msg.language.Embeds}:\n\n${msg.embeds
      ?.map((e) => JSON.stringify(e, null, 2))
      .join('\n\n')}`;

    files.push({ name: 'Embeds.txt', blob: new Blob([embedCodes], { type: 'text/plain' }) });
  }

  const m = await client.ch.send(
    { id: channels, guildId: msg.guildId },
    { embeds: [embed], files: files?.filter((f) => !!f) },
    msg.language,
    undefined,
    !secondMessageFiles?.length ? 5000 : undefined,
  );

  if (!secondMessageFiles?.length) return;
  if (!m?.[0]) return;

  m.forEach(async (message) => {
    if (!message) return;

    const noticeEmbed: DDeno.Embed = {
      type: 'rich',
      description: lan.attachmentsLog(message),
      color: client.customConstants.colors.ephemeral,
    };

    const channel = await client.cache.channels.get(message.channelId);
    if (!channel) return;

    const m2 = await client.ch.send(
      channel,
      {
        embeds: [noticeEmbed],
        files: secondMessageFiles.filter((f) => !!f) as never,
      },
      msg.language,
    );

    if (!m2) return;

    const noticeEmbed2: DDeno.Embed = {
      type: 'rich',
      description: lan.deleteLog(msg),
      color: client.customConstants.colors.ephemeral,
    };

    client.helpers
      .editMessage(message.channelId, message.id, { embeds: [embed, noticeEmbed2] })
      .catch(() => null);
  });
};
