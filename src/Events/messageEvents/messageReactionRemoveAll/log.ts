import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (
 msg: Discord.Message,
 reactions: Discord.Collection<string | Discord.Snowflake, Discord.MessageReaction>,
) => {
 if (!msg.inCachedGuild()) return;

 const channels = await ch.getLogChannels('reactionevents', msg.guild);
 if (!channels) return;

 const language = await ch.languageSelector(msg.guildId);
 const lan = language.events.logs.reaction;
 const con = ch.constants.events.logs.reaction;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameRemoveAll,
   icon_url: con.remove,
   url: msg.url,
  },
  description: lan.descRemovedAll(msg),
  color: ch.constants.colors.danger,
  fields: [],
 };

 if (reactions.size) {
  embed.fields?.push({
   name: lan.reactions,
   value: reactions
    ?.map((r) => `\`${ch.spaces(`${r.count}`, 5)}\` ${language.languageFunction.getEmote(r.emoji)}`)
    .join('\n'),
  });

  const users = ch.txtFileWriter(
   reactions.map((r) => r.users.cache.map(String).join(', ')).join('\n'),
   undefined,
   lan.reactions,
  );

  if (users) files.push(users);
 }

 ch.send({ id: channels, guildId: msg.guildId }, { embeds: [embed], files }, undefined, 10000);
};
