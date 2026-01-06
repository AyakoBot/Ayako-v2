import { type Message } from 'discord.js';

export default async (msg: Message<true>) => {
 if (!msg.author) return;
 if (msg.author.bot) return;

 const dmThread = await msg.client.util.DataBase.dMTicket.findFirst({
  where: { channelId: msg.channel.id },
  include: { settings: true },
 });
 if (!dmThread) return;

 if (
  dmThread.settings.sendMessagePrefixes.length &&
  !dmThread.settings.sendMessagePrefixes.some((p) => msg.content.startsWith(p))
 )
  return;

 const content = dmThread.settings.sendMessagePrefixes.length
  ? msg.content
     .replace(
      new RegExp(
       `^(${dmThread.settings.sendMessagePrefixes.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      ),
      '',
     )
     .trim()
  : msg.content;
 if (!content) return;

 const language = await msg.client.util.getLanguage(msg.guild.id);

 const m = await msg.client.util.request.channels.sendMessage(null, dmThread.dmId, {
  content,
  embeds: [
   {
    description: `-# ${language.ticketing.sentBySupport} - [${language.ticketing.reportAbuse}](${msg.client.util.constants.standard.support})`,
   },
  ],
  files: await msg.client.util.fileURL2Buffer(msg.attachments.map((a) => a.url)),
 }, msg.client);

 if (!m || 'message' in m) {
  const language = await msg.client.util.getLanguage(msg.guild.id);

  msg.client.util.errorMsg(msg, language.ticketing.messageFailedDeliver, language);
  msg.client.util.request.channels.addReaction(
   msg,
   msg.client.util.constants.standard.getEmoteIdentifier(
    msg.client.util.emotes.crossWithBackground,
   ),
  );
  return;
 }

 msg.client.util.request.channels.addReaction(
  msg,
  msg.client.util.constants.standard.getEmoteIdentifier(msg.client.util.emotes.tickWithBackground),
 );
};
