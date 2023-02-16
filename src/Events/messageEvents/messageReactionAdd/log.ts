import type * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';

export default async (
  reaction: Discord.MessageReaction,
  user: Discord.User,
  msg: Discord.Message,
) => {
  if (!msg.guild) return;

  const channels = await ch.getLogChannels('reactionevents', msg.guild);
  if (!channels) return;

  const language = await ch.languageSelector(msg.guild.id);
  const lan = language.events.logs.reaction;
  const con = ch.constants.events.logs.reaction;
  const files: Discord.AttachmentPayload[] = [];
  const embeds: Discord.APIEmbed[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.create,
      name: lan.nameAdd,
    },
    description: lan.descAdded(reaction.emoji, user, msg),
    fields: [],
    color: ch.constants.colors.success,
  };

  embeds.push(embed);

  if (msg.reactions.cache?.size) {
    embeds.push({
      title: lan.reactions,
      description: msg.reactions.cache
        .map(
          (r) =>
            `\`${ch.spaces(`${r.count}`, 5)}\` ${
              (reaction.emoji.id && r.emoji.id && reaction.emoji.id === r.emoji.id) ||
              (!reaction.emoji.id && reaction.emoji.name === r.emoji.name)
                ? ` ${ch.stringEmotes.plusBG}`
                : ` ${ch.stringEmotes.invis}`
            } ${language.languageFunction.getEmote(r.emoji)}`,
        )
        .join(''),
      color: ch.constants.colors.ephemeral,
    });
  }

  if (reaction.emoji.url) {
    embed.thumbnail = {
      url: `attachment://${reaction.emoji.name ?? reaction.emoji.id}`,
    };

    const attachment = (await ch.fileURL2Buffer([reaction.emoji.url])).filter(
      (e): e is Discord.AttachmentPayload => !!e,
    );

    if (attachment) files.push(...attachment);
  }

  await ch.send({ id: channels, guildId: msg.guild.id }, { embeds, files }, undefined, 10000);
};
