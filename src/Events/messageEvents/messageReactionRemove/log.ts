import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  reaction: Discord.MessageReaction,
  user: Discord.User,
  msg: Discord.Message,
) => {
  if (!msg.guild) return;

  const channels = await client.ch.getLogChannels('reactionevents', msg.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(msg.guild.id);
  const lan = language.events.logs.reaction;
  const con = client.customConstants.events.logs.reaction;
  const files: Discord.AttachmentPayload[] = [];
  const embeds: Discord.APIEmbed[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.remove,
      name: lan.nameRemove,
    },
    description: lan.descRemoved(reaction.emoji, user, msg),
    fields: [],
    color: client.customConstants.colors.danger,
  };

  embeds.push(embed);

  if (msg.reactions.cache?.size) {
    embeds.push({
      title: lan.reactions,
      description: (msg.reactions.cache ?? [{ count: 0, emoji: reaction.emoji }])
        ?.map(
          (r) =>
            `\`${client.ch.spaces(`${r.count}`, 5)}\` ${
              (reaction.emoji.id && r.emoji.id && reaction.emoji.id === r.emoji.id) ||
              (!reaction.emoji.id && reaction.emoji.name === r.emoji.name)
                ? ` ${client.stringEmotes.minusBG}`
                : ` ${client.stringEmotes.invis}`
            } ${language.languageFunction.getEmote(r.emoji)}`,
        )
        .join(''),
      color: client.customConstants.colors.ephemeral,
    });
  }

  if (reaction.emoji.url) {
    embed.thumbnail = {
      url: `attachment://${client.ch.getNameAndFileType(reaction.emoji.url)}`,
    };

    const attachment = (await client.ch.fileURL2Buffer([reaction.emoji.url]))?.[0];
    if (attachment) files.push(attachment);
  }

  await client.ch.send(
    { id: channels, guildId: msg.guild.id },
    { embeds, files },
    language,
    undefined,
    10000,
  );
};
