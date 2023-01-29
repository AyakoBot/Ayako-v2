import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (reaction: Discord.MessageReaction, msg: Discord.Message) => {
  if (!msg.guild) return;

  const channels = await client.ch.getLogChannels('reactionevents', msg.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(msg.guild.id);
  const lan = language.events.logs.reaction;
  const con = client.customConstants.events.logs.reaction;
  const files: Discord.AttachmentPayload[] = [];
  if (!msg) return;

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameRemoveEmoji,
      icon_url: con.remove,
      url: client.ch.getJumpLink(msg),
    },
    description: lan.descRemoveEmoji(msg, reaction.emoji),
    color: client.customConstants.colors.danger,
    fields: [],
  };

  if (reaction.emoji.url) {
    embed.thumbnail = {
      url: `attachment://${reaction.emoji.name ?? reaction.emoji.id}`,
    };

    const attachment = (await client.ch.fileURL2Buffer([reaction.emoji.url])).filter(
      (e): e is Discord.AttachmentPayload => !!e,
    );

    if (attachment) files.push(...attachment);
  }

  if (reaction.users.cache.size) {
    embed.fields?.push({
      name: lan.count,
      value: String(reaction.count),
    });

    const users = client.ch.txtFileWriter(
      reaction.users.cache.map((r) => r.id).join(', '),
      undefined,
      lan.reactions,
    );

    if (users) files.push(users);
  }

  await client.ch.send(
    { id: channels, guildId: msg.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
