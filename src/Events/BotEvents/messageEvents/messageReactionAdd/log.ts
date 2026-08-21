import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

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

 const embed: Discord.APIEmbed = {
  author: { icon_url: con.create, name: lan.nameAdd },
  description: lan.descAdded(reaction.emoji, user, msg),
  fields: [],
  color: CT.Colors.Success,
  timestamp: new Date().toISOString(),
  thumbnail: {
   url: msg.client.util.constants.standard.emoteURL(reaction.emoji),
  },
 };

 await msg.client.util.send(
  { id: channels, guildId: msg.guildId },
  { embeds: [embed] },
  10000,
 );
};
