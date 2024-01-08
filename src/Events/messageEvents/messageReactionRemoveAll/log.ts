import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 msg: Discord.Message,
 reactions: Discord.Collection<string | Discord.Snowflake, Discord.MessageReaction>,
) => {
 if (!msg.inGuild()) return;

 const channels = await msg.client.util.getLogChannels('messageevents', msg.guild);
 if (!channels) return;

 const language = await msg.client.util.getLanguage(msg.guildId);
 const lan = language.events.logs.reaction;
 const con = msg.client.util.constants.events.logs.reaction;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameRemoveAll,
   icon_url: con.remove,
   url: msg.url,
  },
  description: lan.descRemovedAll(msg),
  color: CT.Colors.Danger,
  fields: [],
  timestamp: new Date().toISOString(),
 };

 if (reactions.size) {
  embed.fields?.push({
   name: lan.reactions,
   value: reactions
    ?.map(
     (r) =>
      `\`${msg.client.util.spaces(`${r.count}`, 5)}\` ${language.languageFunction.getEmote(
       r.emoji,
      )}`,
    )
    .join('\n'),
  });

  const users = msg.client.util.txtFileWriter(
   reactions.map((r) => r.users.cache.map(String).join(', ')).join('\n'),
   undefined,
   lan.reactions,
  );

  if (users) files.push(users);
 }

 msg.client.util.send({ id: channels, guildId: msg.guildId }, { embeds: [embed], files }, 10000);
};
