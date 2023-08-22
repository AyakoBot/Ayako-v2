import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (msg: Discord.Message) => {
 if (!msg.inGuild()) return;
 if (!msg.author) return;

 const channels = await ch.getLogChannels('messageevents', msg.guild);
 if (!channels) return;

 const language = await ch.languageSelector(msg.guildId);
 const lan = language.events.logs.message;
 const con = ch.constants.events.logs.message;
 const audit = await ch.getAudit(msg.guild, 72, msg.id);
 const auditUser = audit?.executor ?? msg.author;
 const files: Discord.AttachmentPayload[] = [];
 const embeds: Discord.APIEmbed[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.delete,
   name: lan.nameDelete,
  },
  description: auditUser ? lan.descDeleteAudit(auditUser, msg) : lan.descDelete(msg),
  fields: [],
  color: ch.constants.colors.danger,
  timestamp: new Date().toISOString(),
 };

 embeds.push(embed);

 const flagsText = [
  ...msg.flags.toArray().map((f) => lan.flags[f]),
  msg.tts ? lan.tts : null,
  msg.mentions.everyone ? lan.mentionEveryone : null,
  msg.pinned ? lan.pinned : null,
  msg.editedTimestamp ? lan.edited : null,
  msg.activity ? `${lan.activityName} ${lan.activity[msg.activity.type]}` : null,
  msg.interaction ? `${lan.interactionName} ${lan.interaction[msg.interaction.type]}` : null,
  msg.type ? lan.type[msg.type] : null,
  msg.author.bot ? lan.isFromBot : null,
 ]
  .filter((f): f is string => !!f)
  .map((f) => `\`${f}\``)
  .join(', ');

 if (flagsText?.length) {
  embed.fields?.push({
   name: language.Flags,
   value: flagsText,
   inline: true,
  });
 }

 if (msg.components?.length) {
  const components = ch.txtFileWriter(
   msg.components.map((c) => JSON.stringify(c, null, 2)),
   undefined,
   lan.components,
  );

  if (components) files.push(components);
 }

 if (msg.reactions.cache?.size) {
  embed.fields?.push({
   name: lan.reactions,
   value: msg.reactions.cache
    .map((r) => `\`${ch.spaces(`${r.count}`, 5)}\` ${language.languageFunction.getEmote(r.emoji)}`)
    .join(''),
  });
 }

 if (msg.thread) {
  embed.fields?.push({
   name: language.channelTypes[msg.thread.type],
   value: language.languageFunction.getChannel(msg.thread, language.channelTypes[msg.thread.type]),
  });
 }

 if (msg.stickers?.size) {
  embed.fields?.push({
   name: lan.stickers,
   value: msg.stickers.map((s) => `\`${s.name}\` / \`${s.id}\``).join('\n'),
  });
 }

 if (msg.webhookId) {
  const webhook = await ch.cache.webhooks.get(msg.webhookId, msg.channelId, msg.guild);

  if (webhook) {
   embed.fields?.push({
    name: language.Webhook,
    value: language.languageFunction.getWebhook(webhook),
   });
  }
 }

 if (msg.reference) {
  embed.fields?.push({
   name: lan.referenceMessage,
   value: language.languageFunction.getMessage(msg.reference),
  });
 }

 if (msg.embeds?.length) {
  const msgEmbeds = ch.txtFileWriter(
   msg.embeds.map((c) => JSON.stringify(c, null, 2)),
   undefined,
   lan.embeds,
  );

  if (msgEmbeds) files.push(msgEmbeds);
 }

 if (msg.mentions.users.size) {
  embed.fields?.push({
   name: lan.mentionedUsers,
   value: msg.mentions.users.map((m) => `<@${m.id}>`).join(', '),
  });
 }

 if (msg.mentions.roles.size) {
  embed.fields?.push({
   name: lan.mentionedRoles,
   value: msg.mentions.roles.map((m) => `<@&${m.id}>`).join(', '),
  });
 }

 if (msg.mentions.channels.size) {
  embed.fields?.push({
   name: lan.mentionedChannels,
   value: msg.mentions.channels.map((m) => `<#${m.id}>`).join(', '),
  });
 }

 if (msg.content) {
  if (msg.content?.length > 1024) {
   const content = ch.txtFileWriter(msg.content, undefined, language.content);
   if (content) files.push(content);
  } else {
   embed.fields?.push({
    name: language.content,
    value: msg.content ?? language.None,
    inline: false,
   });
  }
 }

 if (msg.attachments?.size) {
  const attachments = (await ch.fileURL2Buffer(msg.attachments.map((a) => a.url))).filter(
   (e): e is Discord.AttachmentPayload => !!e,
  );

  if (attachments?.length) files.push(...attachments);
 }

 ch.send({ id: channels, guildId: msg.guildId }, { embeds, files }, undefined, 10000);
};
