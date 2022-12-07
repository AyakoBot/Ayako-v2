import type DDeno from 'discordeno';
import Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (message: DDeno.Message, oldMsg: DDeno.Message) => {
  const channels = await client.ch.getLogChannels('messageevents', message);
  if (!channels) return;

  const msg = await (await import('../messageCreate/messageCreate')).convertMsg(message);

  publishLog(msg as CT.MessageGuild, oldMsg, channels);
  updateLog(msg as CT.MessageGuild, oldMsg, channels);
  pinLog(msg as CT.MessageGuild, oldMsg, channels);
};

const publishLog = async (msg: CT.MessageGuild, oldMsg: DDeno.Message, channels: bigint[]) => {
  if (
    new Discord.MessageFlagsBitField(msg.flags).has(1) &&
    new Discord.MessageFlagsBitField(oldMsg.flags).has(1)
  ) {
    return;
  }

  if (
    !new Discord.MessageFlagsBitField(msg.flags).has(1) &&
    !new Discord.MessageFlagsBitField(oldMsg.flags).has(1)
  ) {
    return;
  }

  const lan = msg.language.events.messageUpdate.LogPublish;
  const con = client.customConstants.events.messageUpdate;

  const getEmbed = () => {
    const embed: DDeno.Embed = {
      author: {
        name: lan.title,
        iconUrl: con.MessageUpdate,
        url: client.ch.getJumpLink(msg),
      },
      description: lan.description(msg),
      fields: [],
    };

    return embed;
  };

  const embed = getEmbed();
  embed.color = con.color;

  await client.ch.send(
    { id: channels, guildId: msg.guildId },
    { embeds: [embed] },
    msg.language,
    undefined,
    10000,
  );
};

const updateLog = async (msg: CT.MessageGuild, oldMsg: DDeno.Message, channels: bigint[]) => {
  if (
    !new Discord.MessageFlagsBitField(msg.flags).has(1) &&
    new Discord.MessageFlagsBitField(oldMsg.flags).has(1)
  ) {
    return;
  }

  if (
    !new Discord.MessageFlagsBitField(msg.flags).has(1) &&
    new Discord.MessageFlagsBitField(oldMsg.flags).has(1)
  ) {
    return;
  }

  const lan = msg.language.events.messageUpdate.update;
  const con = client.customConstants.events.messageUpdate;

  const getEmbed = () => {
    const description =
      msg.content !== oldMsg.content ? lan.contentUpdate(msg) : lan.otherUpdates(msg);

    const embed: DDeno.Embed = {
      author: {
        name: lan.title,
        iconUrl: con.MessageUpdate,
        url: client.ch.getJumpLink(msg),
      },
      description,
      color: con.color,
      fields: [],
    };

    return embed;
  };

  const embed = getEmbed();
  const firstMessageFiles: DDeno.FileContent[] = [];
  const secondMessageFiles: DDeno.FileContent[] = [];
  const changes: string[] = [];

  const attachmentsUpdated = async () => {
    changes.push('attachments');

    const updatedAttachments: DDeno.Attachment[] = [];
    const addedAttachments = msg.attachments.filter(
      (a1) => !oldMsg.attachments.map((a2) => a2.id).includes(a1.id),
    );
    const removedAttachments = oldMsg.attachments.filter(
      (a1) => !msg.attachments.map((a2) => a2.id).includes(a1.id),
    );

    updatedAttachments.push(...addedAttachments, ...removedAttachments);

    const buffers: {
      blob: Blob;
      name: string;
    }[] = (await client.ch.fileURL2Buffer(updatedAttachments.map((a) => a.url))).filter(
      (b): b is typeof buffers[0] => !!b,
    );

    secondMessageFiles.push(...buffers);
  };

  const embedsUpdated = () => {
    changes.push('embeds');

    const updatedEmbeds: DDeno.Embed[] = [];
    const addedEmbeds = msg.embeds.filter(
      (a1) => !oldMsg.embeds.map((a2) => JSON.stringify(a2)).includes(JSON.stringify(a1)),
    );
    const removedEmbeds = oldMsg.embeds.filter(
      (a1) => !msg.embeds.map((a2) => JSON.stringify(a2)).includes(JSON.stringify(a1)),
    );

    updatedEmbeds.push(...addedEmbeds, ...removedEmbeds);

    if (!updatedEmbeds?.length) return;

    const embedCodes = `${msg.language.Embeds}:\n\n${updatedEmbeds
      ?.map((e) => JSON.stringify(e, null, 2))
      .join('\n\n')}`;

    firstMessageFiles.push({
      name: 'Embeds.txt',
      blob: new Blob([embedCodes], { type: 'text/plain' }),
    });
  };

  const contentUpdated = () => {
    changes.push('content');

    if (!embed.fields) embed.fields = [];

    if (!msg.content?.length && oldMsg.content?.length) {
      chunker(lan.oldContent, oldMsg.content);
      return;
    }

    if (msg.content?.length && !oldMsg.content?.length) {
      chunker(lan.newContent, msg.content);
      return;
    }

    chunker(lan.oldContent, oldMsg.content);
    chunker(lan.newContent, msg.content);
  };

  const chunker = (contentName: string, c: string) => {
    if (c.length <= 1024) {
      embed.fields?.push({ name: contentName, value: c });
      return;
    }

    const chunks: string[] = [];

    let content = String(c);
    while (content.length > 1024) {
      const chunk = content.slice(0, 1024);
      chunks.push(chunk);
      content = content.slice(1024);
    }
    const chunk = content.slice(0, 1024);
    chunks.push(chunk);

    chunks.forEach((thisChunk) => {
      embed.fields?.push({ name: '\u200b', value: thisChunk });
    });
  };

  switch (true) {
    case oldMsg.attachments.map((a) => a.id).join(' ') !==
      msg.attachments.map((a) => a.id).join(' '): {
      await attachmentsUpdated();
      break;
    }
    case JSON.stringify(
      msg.embeds
        .map((e) => {
          if (e.thumbnail) {
            e.thumbnail.width = 0;
            e.thumbnail.height = 0;
          }

          if (e.image) {
            e.image.width = 0;
            e.image.height = 0;
          }

          return e;
        })
        .filter((e) => e.type === 'rich'),
    ) !==
      JSON.stringify(
        oldMsg.embeds
          .map((e) => {
            if (e.thumbnail) {
              e.thumbnail.width = 0;
              e.thumbnail.height = 0;
            }

            if (e.image) {
              e.image.width = 0;
              e.image.height = 0;
            }

            return e;
          })
          .filter((e) => e.type === 'rich'),
      ): {
      embedsUpdated();
      break;
    }
    case oldMsg.content !== msg.content: {
      contentUpdated();
      break;
    }
    default: {
      break;
    }
  }

  if (!changes.length) return;

  const messages = await client.ch.send(
    { id: channels, guildId: msg.guildId },
    {
      embeds: [embed],
      files: firstMessageFiles,
    },
    msg.language,
    undefined,
    !secondMessageFiles.length ? 10000 : undefined,
  );

  if (!secondMessageFiles.length) return;
  if (!messages) return;

  messages
    .filter((ms): ms is DDeno.Message => !!ms)
    .forEach(async (message) => {
      const noticeEmbed: DDeno.Embed = {
        description: lan.attachmentsLog(message),
        color: client.customConstants.colors.ephemeral,
      };

      const m2 = await client.ch.send(
        { id: message.channelId, guildId: msg.guildId },
        {
          embeds: [noticeEmbed],
          files: secondMessageFiles.filter((f) => !!f),
        },
        msg.language,
      );

      if (!m2) return;

      const noticeEmbed2: DDeno.Embed = {
        description: lan.updateLog(m2),
        color: client.customConstants.colors.ephemeral,
      };

      client.helpers
        .editMessage(msg.channelId, message.id, { embeds: [embed, noticeEmbed2] })
        .catch(() => null);
    });
};

const pinLog = async (msg: CT.MessageGuild, oldMsg: DDeno.Message, channels: bigint[]) => {
  if (!msg.guild) return;

  const getEmbed = (): DDeno.Embed => ({
    fields: [],
  });
  const embed = getEmbed();
  const changedKeys: string[] = [];

  const pinned = async () => {
    if (!msg.guild) return;
    changedKeys.push('pin');

    const con = client.customConstants.events.channelPin;
    const lan = msg.language.events.channelPin;
    const audit = await client.ch.getAudit(msg.guild, 74, msg.id);

    if (audit && audit.userId) {
      const user = await client.cache.users.get(audit.userId);
      if (user) embed.description = lan.descDetails(user, msg);
      else embed.description = lan.desc(msg);
    } else embed.description = lan.desc(msg);

    embed.color = con.color;

    embed.author = {
      name: lan.title,
      iconUrl: con.image,
      url: client.ch.getJumpLink(msg),
    };
  };

  const unpinned = async () => {
    if (!msg.guild) return;
    changedKeys.push('unpin');

    const con = client.customConstants.events.channelUnPin;
    const lan = msg.language.events.channelUnPin;
    const audit = await client.ch.getAudit(msg.guild, 75, msg.id);

    if (audit && audit.userId) {
      const user = await client.cache.users.get(audit.userId);
      if (user) embed.description = lan.descDetails(user, msg);
      else embed.description = lan.desc(msg);
    } else embed.description = lan.desc(msg);

    embed.color = con.color;
    embed.author = {
      name: lan.title,
      iconUrl: con.image,
      url: client.ch.getJumpLink(msg),
    };
  };

  switch (true) {
    case !new Discord.MessageFlagsBitField(Number(oldMsg.bitfield)).has(4) &&
      new Discord.MessageFlagsBitField(Number(msg.bitfield)).has(4): {
      await pinned();
      break;
    }
    case new Discord.MessageFlagsBitField(Number(oldMsg.bitfield)).has(4) &&
      !new Discord.MessageFlagsBitField(Number(msg.bitfield)).has(4): {
      unpinned();
      break;
    }
    default: {
      break;
    }
  }

  if (!changedKeys.length) return;

  client.ch.send(
    { id: channels, guildId: msg.guildId },
    { embeds: [embed] },
    msg.language,
    undefined,
    10000,
  );
};
