import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 reaction: Discord.MessageReaction,
 user: Discord.User,
 msg: Discord.Message,
) => {
 if (!msg.inGuild()) return;

 const channels = await msg.client.util.getLogChannels('messageevents', msg.guild);
 if (!channels) return;

 const language = await msg.client.util.getLanguage(msg.guildId);
 const lan = language.events.logs.reaction;
 const con = msg.client.util.constants.events.logs.reaction;
 const files: Discord.AttachmentPayload[] = [];
 const embeds: Discord.APIEmbed[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.create,
   name: lan.nameAdd,
  },
  description: lan.descAdded(reaction.emoji, user, msg),
  fields: [],
  color: CT.Colors.Success,
  timestamp: new Date().toISOString(),
 };

 embeds.push(embed);

 if (msg.reactions.cache?.size) {
  embeds.push({
   title: lan.reactions,
   description: msg.reactions.cache
    .map(
     (r) =>
      `\`${msg.client.util.spaces(`${r.count ?? 1}`, 5)}\` ${
       (reaction.emoji.id && r.emoji.id && reaction.emoji.id === r.emoji.id) ||
       (!reaction.emoji.id && reaction.emoji.name === r.emoji.name)
        ? ` ${msg.client.util.constants.standard.getEmote(msg.client.util.emotes.plusBG)}`
        : ` ${msg.client.util.constants.standard.getEmote(msg.client.util.emotes.invis)}`
      } ${language.languageFunction.getEmote(r.emoji)}`,
    )
    .join(''),
   color: CT.Colors.Ephemeral,
  });
 }

 embed.thumbnail = {
  url: `attachment://${msg.client.util.getNameAndFileType(
   msg.client.util.constants.standard.emoteURL(reaction.emoji),
  )}`,
 };

 const attachment = (
  await msg.client.util.fileURL2Buffer([
   msg.client.util.constants.standard.emoteURL(reaction.emoji),
  ])
 ).filter((e): e is Discord.AttachmentPayload => !!e);

 if (attachment) files.push(...attachment);

 await msg.client.util.send({ id: channels, guildId: msg.guildId }, { embeds, files }, 10000);
};
