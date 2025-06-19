import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import log from './log.js';

export default async (
 msgToLog: Discord.Message | Discord.MessageSnapshot,
 isBulk: Discord.Message<true>[] | boolean = false,
 originalMsg: false | Discord.Message = false,
) => {
 const msg = (originalMsg || msgToLog) as Discord.Message;
 if (!msg.inGuild()) return;

 if (msg.author?.id === (await msg.client.util.getBotIdFromGuild(msg.guild))) return;
 if (!msg.author) return;

 const channels = await msg.client.util.getLogChannels('messageevents', msg.guild);
 if (!channels) return;

 const language = await msg.client.util.getLanguage(msg.guildId);
 const lan = language.events.logs.message;
 const con = msg.client.util.constants.events.logs.message;
 const audit = await msg.client.util.getAudit(msg.guild, 72, msg.id);
 const auditUser = audit?.executor ?? msg.author;
 const files: Discord.AttachmentPayload[] = [];
 const embeds: Discord.APIEmbed[] = [];

 const getDesc = () => {
  if (originalMsg && auditUser) {
   return lan.descDeleteForwardAudit(auditUser, msgToLog as Discord.MessageSnapshot, originalMsg);
  }
  if (originalMsg) {
   return lan.descDeleteForward(
    msgToLog as Discord.MessageSnapshot,
    originalMsg as Discord.Message,
   );
  }
  if (auditUser) return lan.descDeleteAudit(auditUser, msg);
  return lan.descDelete(msg);
 };

 const embed: Discord.APIEmbed = {
  author: { icon_url: con.delete, name: originalMsg ? lan.nameForwardDelete : lan.nameDelete },
  description: getDesc(),
  fields: [],
  color: CT.Colors.Danger,
  timestamp: new Date().toISOString(),
 };

 embeds.push(embed);

 const flagsText = [
  ...msgToLog.flags.toArray().map((f) => lan.flags[f]),
  msgToLog.tts ? lan.tts : null,
  msgToLog.mentions.everyone ? lan.mentionEveryone : null,
  msgToLog.pinned ? lan.pinned : null,
  msgToLog.editedTimestamp ? lan.edited : null,
  msgToLog.activity ? `${lan.activityName} ${lan.activity[msgToLog.activity.type]}` : null,
  msgToLog.interactionMetadata
   ? `${lan.interactionName} ${lan.interaction[msgToLog.interactionMetadata.type]}`
   : null,
  msgToLog.type ? lan.type[msg.type] : null,
  msgToLog.author?.bot ? lan.isFromBot : null,
 ]
  .filter((f): f is string => !!f)
  .map((f) => `\`${f}\``)
  .join(', ');

 if (flagsText?.length) {
  embed.fields?.push({
   name: language.t.Flags,
   value: flagsText,
   inline: true,
  });
 }

 if (msgToLog.components?.length) {
  const components = msg.client.util.txtFileWriter(
   msgToLog.components.map((c) => JSON.stringify(c, null, 2)),
   undefined,
   lan.components,
  );

  if (components) files.push(components);
 }

 if (msgToLog.reactions?.cache?.size) {
  embed.fields?.push({
   name: lan.reactions,
   value: msgToLog.reactions.cache
    .map(
     (r) =>
      `\`${msg.client.util.spaces(`${r.count}`, 5)}\` ${language.languageFunction.getEmote(
       r.emoji,
      )}`,
    )
    .join(''),
  });
 }

 if (msgToLog.thread) {
  embed.fields?.push({
   name: language.channelTypes[msgToLog.thread.type],
   value: language.languageFunction.getChannel(
    msgToLog.thread,
    language.channelTypes[msgToLog.thread.type],
   ),
  });
 }

 if (msgToLog.stickers?.size) {
  embed.fields?.push({
   name: lan.stickers,
   value: msgToLog.stickers.map((s) => `\`${s.name}\` / \`${s.id}\``).join('\n'),
  });
 }

 if (msgToLog.webhookId && msgToLog.channelId && msgToLog.guild) {
  const webhook = await msg.client.util.cache.webhooks.get(
   msgToLog.webhookId,
   msgToLog.channelId,
   msgToLog.guild,
  );

  if (webhook) {
   embed.fields?.push({
    name: language.t.Webhook,
    value: language.languageFunction.getWebhook(webhook),
   });
  }
 }

 if (msgToLog.reference) {
  embed.fields?.push({
   name: lan.referenceMessage,
   value: language.languageFunction.getMessage(msgToLog.reference),
  });
 }

 if (msgToLog.embeds?.length) {
  const msgEmbeds = msg.client.util.txtFileWriter(
   msgToLog.embeds.map((c) => JSON.stringify(c, null, 2)),
   undefined,
   lan.embeds,
  );

  if (msgEmbeds) files.push(msgEmbeds);
 }

 if (msgToLog.mentions.users.size) {
  embed.fields?.push({
   name: lan.mentionedUsers,
   value: msgToLog.mentions.users.map((m) => `<@${m.id}>`).join(', '),
  });
 }

 if (msgToLog.mentions.roles.size) {
  embed.fields?.push({
   name: lan.mentionedRoles,
   value: msgToLog.mentions.roles.map((m) => `<@&${m.id}>`).join(', '),
  });
 }

 if (msgToLog.mentions.channels.size) {
  embed.fields?.push({
   name: lan.mentionedChannels,
   value: msgToLog.mentions.channels.map((m) => `<#${m.id}>`).join(', '),
  });
 }

 if (msgToLog.content) {
  if (msgToLog.content?.length > 1024) {
   const content = msg.client.util.txtFileWriter(msgToLog.content, undefined, language.t.content);
   if (content) files.push(content);
  } else {
   embed.fields?.push({
    name: language.t.content,
    value: msgToLog.content ?? language.t.None,
    inline: false,
   });
  }
 }

 if (isBulk && Array.isArray(isBulk)) {
  embed.fields?.push({
   name: lan.bulkDelete,
   value: isBulk.map((m) => m.url).join('\n'),
   inline: false,
  });
 }

 if (msgToLog.attachments?.size) {
  const isRemix = msgToLog.attachments.map((a) => a.flags.has(Discord.AttachmentFlags.IsRemix));

  const attachments = (
   await msg.client.util.fileURL2Buffer(msgToLog.attachments.map((a) => a.url))
  ).filter((e): e is Discord.AttachmentPayload => !!e);

  if (attachments?.length) {
   files.push(
    ...attachments.map((a, i) => ({
     ...a,
     description: isRemix[i] ? lan.isRemix : undefined,
    })),
   );
  }
 }

 msgToLog.messageSnapshots?.forEach((m) => log(m, false, msg));

 msg.client.util.send({ id: channels, guildId: msg.guildId }, { embeds, files }, 10000);
};
