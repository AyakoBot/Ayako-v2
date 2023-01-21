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

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.remove,
      name: lan.nameRemove,
    },
    description: lan.descRemoved(reaction.emoji, user, msg),
    fields: [],
    color: client.customConstants.colors.warning,
  };

  if (msg.reactions.cache?.size) {
    embed.fields?.push({
      name: lan.reactions,
      value: msg.reactions.cache
        ?.map(
          (r) =>
            `\`${client.ch.spaces(`${r.users.cache.size}`, 5)}\` ${
              reaction.emoji.id === r.emoji.id ||
              (!reaction.emoji.id && reaction.emoji.name === r.emoji.name)
                ? ` ${client.stringEmotes.plusBG}`
                : ` ${client.stringEmotes.invis}`
            } ${language.languageFunction.getEmote(r.emoji)}`,
        )
        .join('\n'),
    });
  }

  if (reaction.emoji.url) {
    embed.thumbnail = {
      url: `attachment://${reaction.emoji.name ?? reaction.emoji.id}`,
    };

    const attachment = (await client.ch.fileURL2Buffer([reaction.emoji.url])).filter(
      (e): e is Discord.AttachmentPayload => !!e,
    );

    if (attachment) files.push(...attachment);
  }

  await client.ch.send(
    { id: channels, guildId: msg.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
