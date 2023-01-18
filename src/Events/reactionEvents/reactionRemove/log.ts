import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (reaction: CT.ReactionRemove) => {
  if (!reaction.guild.id) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: reaction.guild.id });
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(reaction.guild.id);
  if (!guild) return;

  const user = await client.users.fetch(reaction.userId);
  if (!user) return;

  const msg = await client.ch.cache.messages.get(
    reaction.messageId,
    reaction.channelId,
    reaction.guild.id,
  );
  if (!msg) return;

  const language = await client.ch.languageSelector(reaction.guild.id);
  const lan = language.events.logs.reaction;
  const con = client.customConstants.events.logs.reaction;
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.remove,
      name: lan.nameRemove,
    },
    description: lan.descRemoved(reaction.emoji, user, msg),
    fields: [],
    color: client.customConstants.colors.warning,
  };

  const reactions = client.ch.cache.reactions.cache
    .get(reaction.guild.id)
    ?.get(reaction.channelId)
    ?.get(reaction.messageId);

  if (reactions) {
    const reactionArray = Array.from(reactions, ([, r]) => r);

    embed.fields?.push({
      name: lan.reactions,
      value: reactionArray
        ?.map(
          (r) =>
            `\`${client.ch.spaces(`${r.users.length}`, 5)}\` ${
              reaction.emoji.id === r.emoji.id ||
              (!reaction.emoji.id && reaction.emoji.name === r.emoji.name)
                ? ` ${client.stringEmotes.plusBG}`
                : ` ${client.stringEmotes.invis}`
            } ${language.languageFunction.getEmote(r.emoji)}`,
        )
        .join('\n'),
    });
  }

  if (reaction.emoji.toggles.requireColons && reaction.emoji.id) {
    embed.thumbnail = {
      url: `attachment://${reaction.emoji.name ?? reaction.emoji.id}`,
    };

    const attachment = (
      await client.ch.fileURL2Blob([
        client.helpers.getEmojiURL(reaction.emoji.id, reaction.emoji.toggles.animated),
      ])
    ).filter(
      (
        e,
      ): e is {
        blob: Blob;
        name: string;
      } => !!e,
    );

    if (attachment) files.push(...attachment);
  }

  await client.ch.send(
    { id: channels, guildId: reaction.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
