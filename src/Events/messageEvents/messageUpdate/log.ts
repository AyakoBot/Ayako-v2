import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 const channels = await ch.getLogChannels('messageevents', msg.guild);
 if (!channels) return;

 const language = await ch.languageSelector(msg.guildId);
 const lan = language.events.logs.message;
 const con = ch.constants.events.logs.message;
 const files: Discord.AttachmentPayload[] = [];
 let byAuthor: boolean | null = true;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.update,
   name: lan.nameUpdate,
  },
  fields: [],
  color: ch.constants.colors.loading,
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  ch.mergeLogging(before, after, type, embed, language, name);

 if (oldMsg.flags !== msg.flags) {
  const oldFlags = new Discord.MessageFlagsBitField(oldMsg.flags).toArray();
  const newFlags = new Discord.MessageFlagsBitField(msg.flags).toArray();

  const added = (ch.getDifference(oldFlags, newFlags) as Discord.MessageFlagsString[]).map(
   (f) => lan.flags[f],
  );
  const removed = (ch.getDifference(newFlags, oldFlags) as Discord.MessageFlagsString[]).map(
   (f) => lan.flags[f],
  );

  if (added.length || removed.length) merge(added, removed, 'difference', language.Flags);
 }
 if (
  JSON.stringify(oldMsg.components) !== JSON.stringify(msg.components) &&
  !!oldMsg.components?.length
 ) {
  if (oldMsg.components?.length) {
   const components = ch.txtFileWriter(
    oldMsg.components.map((c) => JSON.stringify(c, null, 2)),
    undefined,
    lan.components,
   );

   if (components) files.push(components);
  }
 }
 if (oldMsg.editedTimestamp !== msg.editedTimestamp) {
  merge(
   oldMsg.editedTimestamp ? ch.constants.standard.getTime(oldMsg.editedTimestamp) : language.None,
   msg.editedTimestamp ? ch.constants.standard.getTime(msg.editedTimestamp) : language.None,
   'string',
   lan.editedTimestamp,
  );
 }
 if (oldMsg.activity?.type !== msg.activity?.type) {
  merge(
   oldMsg.activity ? lan.activity[oldMsg.activity?.type] : language.None,
   msg.activity ? lan.activity[msg.activity?.type] : language.None,
   'string',
   language.Flags,
  );

  byAuthor = false;
 }
 if (oldMsg.thread?.id !== msg.thread?.id) {
  merge(
   oldMsg.thread
    ? language.languageFunction.getChannel(oldMsg.thread, language.channelTypes[oldMsg.thread.type])
    : language.None,
   msg.thread
    ? language.languageFunction.getChannel(msg.thread, language.channelTypes[msg.thread.type])
    : language.None,
   'string',
   language.channelTypes[(msg.thread ?? oldMsg.thread)?.type ?? 11],
  );

  byAuthor = false;
 }
 if (JSON.stringify(oldMsg.stickers) !== JSON.stringify(msg.stickers)) {
  const oldStickers = ch.getDifference(
   oldMsg.stickers.map((o) => o) ?? [],
   msg.stickers.map((o) => o) ?? [],
  );
  const newStickers = ch.getDifference(
   msg.stickers.map((o) => o) ?? [],
   oldMsg.stickers.map((o) => o) ?? [],
  );

  merge(oldStickers, newStickers, 'difference', lan.stickers);
 }
 if (oldMsg.type !== msg.type) {
  merge(
   lan.type[oldMsg.type] ?? language.unknown,
   lan.type[msg.type] ?? language.unknown,
   'string',
   language.Type,
  );

  byAuthor = false;
 }
 if (oldMsg.content !== msg.content) {
  if (oldMsg.content?.length > 1024) {
   const content = ch.txtFileWriter(oldMsg.content, undefined, language.content);
   if (content) files.push(content);
  } else {
   embed.fields?.push({
    name: lan.beforeContent,
    value: oldMsg.content ?? language.None,
    inline: false,
   });
  }

  if (msg.content?.length > 1024) {
   const content = ch.txtFileWriter(msg.content, undefined, language.content);
   if (content) files.push(content);
  } else {
   embed.fields?.push({
    name: lan.afterContent,
    value: msg.content ?? language.None,
    inline: false,
   });
  }
 }
 if (JSON.stringify(oldMsg.embeds.map((o) => o)) !== JSON.stringify(msg.embeds.map((o) => o))) {
  if (!msg.embeds.length) byAuthor = null;

  if (oldMsg.embeds?.length) {
   const embedFile = ch.txtFileWriter(
    JSON.stringify(oldMsg.embeds, null, 2),
    undefined,
    language.Embeds,
   );
   if (embedFile) files.push(embedFile);
  }
 }
 if (msg.mentions.everyone !== oldMsg.mentions.everyone) {
  merge(oldMsg.mentions.everyone, msg.mentions.everyone, 'boolean', lan.mentionEveryone);
 }
 if (
  JSON.stringify(oldMsg.attachments.map((o) => o)) !== JSON.stringify(msg.attachments.map((o) => o))
 ) {
  if (!msg.attachments.size) byAuthor = null;

  const oldAttachments = ch.getDifference(
   oldMsg.attachments.map((o) => o) ?? [],
   msg.attachments.map((o) => o) ?? [],
  );

  const attachments = (await ch.fileURL2Buffer(oldAttachments.map((a) => a.url))).filter(
   (e): e is Discord.AttachmentPayload => !!e,
  );

  if (attachments?.length) files.push(...attachments);
 }
 if (
  JSON.stringify(oldMsg.mentions.users.map((o) => o)) !==
  JSON.stringify(msg.mentions.users.map((o) => o))
 ) {
  const oldMentions = ch.getDifference(
   oldMsg.mentions.users.map((o) => o),
   msg.mentions.users.map((o) => o),
  );
  const newMentions = ch.getDifference(
   msg.mentions.users.map((o) => o),
   oldMsg.mentions.users.map((o) => o),
  );

  merge(
   oldMentions.map((i) => `<@${i}>`).join(', '),
   newMentions.map((i) => `<@${i}>`).join(', '),
   'string',
   lan.mentionedUsers,
  );
 }
 if (
  JSON.stringify(oldMsg.mentions.roles.map((o) => o)) !==
  JSON.stringify(msg.mentions.roles.map((o) => o))
 ) {
  const oldMentions = ch.getDifference(
   oldMsg.mentions.roles.map((o) => o),
   msg.mentions.roles.map((o) => o),
  );
  const newMentions = ch.getDifference(
   msg.mentions.roles.map((o) => o),
   oldMsg.mentions.roles.map((o) => o),
  );

  merge(
   oldMentions.map((i) => `<@&${i}>`).join(', '),
   newMentions.map((i) => `<@&${i}>`).join(', '),
   'string',
   lan.mentionedRoles,
  );
 }
 if (
  JSON.stringify(oldMsg.mentions.channels.map((o) => o)) !==
  JSON.stringify(msg.mentions.channels.map((o) => o))
 ) {
  const oldMentions = ch.getDifference(
   oldMsg.mentions.channels.map((o) => o),
   msg.mentions.channels.map((o) => o),
  );
  const newMentions = ch.getDifference(
   msg.mentions.channels.map((o) => o),
   oldMsg.mentions.channels.map((o) => o),
  );

  merge(
   oldMentions.map((i) => `<#${i}>`).join(', '),
   newMentions.map((i) => `<#${i}>`).join(', '),
   'string',
   lan.mentionedChannels,
  );
 }

 if (byAuthor === null) {
  embed.description = lan.descUpdateMaybe(msg);
 } else if (byAuthor === false) {
  embed.description = lan.descUpdate(msg);
 } else embed.description = lan.descUpdateAuthor(msg);

 ch.send({ id: channels, guildId: msg.guildId }, { embeds: [embed], files }, undefined, 10000);
};
