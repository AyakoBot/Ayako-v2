import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 reaction: Discord.MessageReaction,
 user: Discord.User,
 msg: Discord.Message,
) => {
 if (!msg.inGuild()) return;

 const channels = await reaction.client.util.getLogChannels('messageevents', msg.guild);
 if (!channels) return;

 const language = await reaction.client.util.getLanguage(msg.guildId);
 const lan = language.events.logs.reaction;
 const con = reaction.client.util.constants.events.logs.reaction;
 const files: Discord.AttachmentPayload[] = [];
 const embeds: Discord.APIEmbed[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.remove,
   name: lan.nameRemove,
  },
  description: lan.descRemoved(reaction.emoji, user, msg),
  fields: [],
  color: CT.Colors.Danger,
  timestamp: new Date().toISOString(),
 };

 embeds.push(embed);

 if (msg.reactions.cache.filter((r) => Number(r.count) !== 0)?.size) {
  embeds.push({
   title: lan.reactions,
   description: (msg.reactions.cache ?? [{ count: 0, emoji: reaction.emoji }])
    .filter((r) => Number(r.count) !== 0)
    ?.map(
     (r) =>
      `\`${reaction.client.util.spaces(`${Number(r.count)}`, 5)}\` ${
       (reaction.emoji.id && r.emoji.id && reaction.emoji.id === r.emoji.id) ||
       (!reaction.emoji.id && reaction.emoji.name === r.emoji.name)
        ? ` ${reaction.client.util.constants.standard.getEmote(
           reaction.client.util.emotes.minusBG,
          )}`
        : ` ${reaction.client.util.constants.standard.getEmote(reaction.client.util.emotes.invis)}`
      } ${language.languageFunction.getEmote(r.emoji)}`,
    )
    .join(''),
   color: CT.Colors.Ephemeral,
  });
 }

 embed.thumbnail = {
  url: `attachment://${reaction.client.util.getNameAndFileType(
   reaction.client.util.constants.standard.emoteURL(reaction.emoji),
  )}`,
 };

 const attachment = (
  await reaction.client.util.fileURL2Buffer([
   reaction.client.util.constants.standard.emoteURL(reaction.emoji),
  ])
 )?.[0];
 if (attachment) files.push(attachment);

 await reaction.client.util.send({ id: channels, guildId: msg.guildId }, { embeds, files }, 10000);
};
