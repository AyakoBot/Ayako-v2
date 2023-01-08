import Discord from 'discord.js';
import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';
import type CT from '../../../Typings/CustomTypings';

export default async (msg: DDeno.Message, oldMsg: DDeno.Message) => {
  if (!msg.guildId) return;

  const channels = await client.ch.getLogChannels('messageevents', msg);
  if (!channels) return;

  const guild = await client.cache.guilds.get(msg.guildId);
  if (!guild) return;

  const user = await client.cache.users.get(msg.authorId);
  if (!user) return;

  const language = await client.ch.languageSelector(msg.guildId);
  const lan = language.events.logs.message;
  const con = client.customConstants.events.logs.message;
  const files: DDeno.FileContent[] = [];
  let byAuthor: boolean | null = true;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.delete,
      name: lan.nameDelete,
    },
    fields: [],
    color: client.customConstants.colors.warning,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case oldMsg.flags !== msg.flags: {
      const oldFlags = new Discord.MessageFlagsBitField(oldMsg.flags).toArray();
      const newFlags = new Discord.MessageFlagsBitField(msg.flags).toArray();

      const added = (
        client.ch.getDifference(oldFlags, newFlags) as Discord.MessageFlagsString[]
      ).map((f) => lan.flags[f]);
      const removed = (
        client.ch.getDifference(newFlags, oldFlags) as Discord.MessageFlagsString[]
      ).map((f) => lan.flags[f]);

      merge(added, removed, 'difference', language.Flags);
      break;
    }
    case JSON.stringify(oldMsg.components) !== JSON.stringify(msg.components) &&
      !!oldMsg.components?.length: {
      if (!oldMsg.components?.length) break;

      const components = client.ch.txtFileWriter(
        oldMsg.components.map((c) => JSON.stringify(c, null, 2)),
        undefined,
        lan.components,
      );

      if (components) files.push(components);
      break;
    }
    case oldMsg.editedTimestamp !== msg.editedTimestamp: {
      merge(
        oldMsg.editedTimestamp
          ? client.customConstants.standard.getTime(oldMsg.editedTimestamp)
          : language.none,
        msg.editedTimestamp
          ? client.customConstants.standard.getTime(msg.editedTimestamp)
          : language.none,
        'string',
        lan.editedTimestamp,
      );
      break;
    }
    case oldMsg.activity?.type !== msg.activity?.type: {
      merge(
        oldMsg.activity ? lan.activity[oldMsg.activity?.type] : language.none,
        msg.activity ? lan.activity[msg.activity?.type] : language.none,
        'string',
        language.Flags,
      );

      byAuthor = false;
      break;
    }
    case oldMsg.thread?.id !== msg.thread?.id: {
      merge(
        oldMsg.thread
          ? language.languageFunction.getChannel(
              oldMsg.thread as DDeno.Channel,
              language.channelTypes[oldMsg.thread.type],
            )
          : language.none,
        msg.thread
          ? language.languageFunction.getChannel(
              msg.thread as DDeno.Channel,
              language.channelTypes[msg.thread.type],
            )
          : language.none,
        'string',
        language.channelTypes[(msg.thread ?? oldMsg.thread)?.type ?? 11],
      );

      byAuthor = false;
      break;
    }
    case JSON.stringify(oldMsg.stickerItems) !== JSON.stringify(msg.stickerItems): {
      const oldStickers = client.ch.getDifference(
        oldMsg.stickerItems ?? [],
        msg.stickerItems ?? [],
      );
      const newStickers = client.ch.getDifference(
        msg.stickerItems ?? [],
        oldMsg.stickerItems ?? [],
      );

      merge(oldStickers, newStickers, 'difference', lan.stickers);
      break;
    }
    case oldMsg.type !== msg.type: {
      merge(lan.type[oldMsg.type], lan.type[msg.type], 'string', language.Type);

      byAuthor = false;
      break;
    }
    case oldMsg.content !== msg.content: {
      if (oldMsg.content?.length > 2000) {
        const content = client.ch.txtFileWriter(oldMsg.content, undefined, language.content);
        if (content) files.push(content);
      } else {
        embed.fields?.push({
          name: lan.beforeContent,
          value: oldMsg.content ?? language.none,
        });
      }

      if (msg.content?.length > 2000) {
        const content = client.ch.txtFileWriter(msg.content, undefined, language.content);
        if (content) files.push(content);
      } else {
        embed.fields?.push({
          name: lan.afterContent,
          value: msg.content ?? language.none,
        });
      }
      break;
    }
    case JSON.stringify(oldMsg.embeds) !== JSON.stringify(msg.embeds): {
      if (!msg.embeds.length) byAuthor = null;

      if (!oldMsg.embeds?.length) break;

      const embedFile = client.ch.txtFileWriter(
        JSON.stringify(oldMsg.embeds, null, 2),
        undefined,
        language.Embeds,
      );
      if (embedFile) files.push(embedFile);
      break;
    }
    case new Discord.PermissionsBitField(msg.bitfield).has(2n) !==
      new Discord.PermissionsBitField(oldMsg.bitfield).has(2n): {
      merge(
        new Discord.PermissionsBitField(oldMsg.bitfield).has(2n),
        new Discord.PermissionsBitField(msg.bitfield).has(2n),
        'boolean',
        lan.mentionEveryone,
      );
      break;
    }
    case JSON.stringify(oldMsg.attachments) !== JSON.stringify(msg.attachments): {
      if (!msg.attachments.length) byAuthor = null;

      const oldAttachments = client.ch.getDifference(
        oldMsg.attachments ?? [],
        msg.attachments ?? [],
      );

      const attachments = (await client.ch.fileURL2Blob(oldAttachments.map((a) => a.url))).filter(
        (
          e,
        ): e is {
          blob: Blob;
          name: string;
        } => !!e,
      );

      if (attachments?.length) files.push(...attachments);
      break;
    }
    case JSON.stringify(oldMsg.mentionedUserIds) !== JSON.stringify(msg.mentionedUserIds): {
      const oldMentions = client.ch.getDifference(oldMsg.mentionedUserIds, msg.mentionedUserIds);
      const newMentions = client.ch.getDifference(msg.mentionedUserIds, oldMsg.mentionedUserIds);

      merge(
        oldMentions.map((i) => `<@${i}>`).join(', '),
        newMentions.map((i) => `<@${i}>`).join(', '),
        'string',
        lan.mentionedUsers,
      );
      break;
    }
    case JSON.stringify(oldMsg.mentionedRoleIds) !== JSON.stringify(msg.mentionedRoleIds): {
      const oldMentions = client.ch.getDifference(oldMsg.mentionedRoleIds, msg.mentionedRoleIds);
      const newMentions = client.ch.getDifference(msg.mentionedRoleIds, oldMsg.mentionedRoleIds);

      merge(
        oldMentions.map((i) => `<@&${i}>`).join(', '),
        newMentions.map((i) => `<@&${i}>`).join(', '),
        'string',
        lan.mentionedRoles,
      );
      break;
    }
    case JSON.stringify(oldMsg.mentionedChannelIds) !== JSON.stringify(msg.mentionedChannelIds): {
      const oldMentions = client.ch.getDifference(
        oldMsg.mentionedChannelIds,
        msg.mentionedChannelIds,
      );
      const newMentions = client.ch.getDifference(
        msg.mentionedChannelIds,
        oldMsg.mentionedChannelIds,
      );

      merge(
        oldMentions.map((i) => `<#${i}>`).join(', '),
        newMentions.map((i) => `<#${i}>`).join(', '),
        'string',
        lan.mentionedChannels,
      );
      break;
    }
    default: {
      return;
    }
  }

  if (byAuthor === null) {
    embed.description = lan.descUpdateMaybe(msg, user);
  } else if (byAuthor === false) {
    embed.description = lan.descUpdate(msg);
  } else embed.description = lan.descUpdateAuthor(msg, user);

  client.ch.send(
    { id: channels, guildId: msg.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    files.length ? undefined : 10000,
  );
};
