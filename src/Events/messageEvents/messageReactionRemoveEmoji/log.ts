import type * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';

export default async (reaction: Discord.MessageReaction, msg: Discord.Message) => {
  if (!msg.guild) return;

  const channels = await ch.getLogChannels('reactionevents', msg.guild);
  if (!channels) return;

  const language = await ch.languageSelector(msg.guild.id);
  const lan = language.events.logs.reaction;
  const con = ch.constants.events.logs.reaction;
  const files: Discord.AttachmentPayload[] = [];
  if (!msg) return;

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameRemoveEmoji,
      icon_url: con.remove,
      url: ch.getJumpLink(msg),
    },
    description: lan.descRemoveEmoji(msg, reaction.emoji),
    color: ch.constants.colors.danger,
    fields: [],
  };

  if (reaction.emoji.url) {
    embed.thumbnail = {
      url: `attachment://${ch.getNameAndFileType(reaction.emoji.url)}`,
    };

    const attachment = (await ch.fileURL2Buffer([reaction.emoji.url]))?.[0];
    if (attachment) files.push(attachment);
  }

  if (reaction.users.cache.size) {
    embed.fields?.push({
      name: lan.count,
      value: String(reaction.count),
    });

    const users = ch.txtFileWriter(
      reaction.users.cache.map((r) => r.id).join(', '),
      undefined,
      lan.reactions,
    );

    if (users) files.push(users);
  }

  await ch.send(
    { id: channels, guildId: msg.guild.id },
    { embeds: [embed], files },
    undefined,
    10000,
  );
};
