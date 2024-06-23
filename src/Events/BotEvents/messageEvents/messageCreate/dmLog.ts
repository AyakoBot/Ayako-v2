import * as Discord from 'discord.js';
import { Colors } from '../../../../Typings/Typings.js';

export default async (msg: Discord.Message<boolean>) => {
 if (!msg.author?.id) return;
 if (msg.author.id === msg.client.user?.id) return;
 if (msg.client.user?.id !== process.env.mainId) return;

 const channel = msg.client.channels.cache.get(
  process.env.dmChannelId ?? '',
 ) as Discord.GuildTextBasedChannel;
 if (!channel) return;

 const user = await msg.client.util.DataBase.dmLog
  .findUnique({
   where: { userId: msg.author.id },
  })
  .then(async (r) => r ?? createDMLog(msg.author, channel));
 if ('message' in user) throw new Error(user.message);

 const mutuals = await msg.client.cluster
  ?.broadcastEval(
   (cl, u) =>
    cl.guilds.cache.filter((g) => g.members.cache.has(u)).map((g) => `\`${g.id} - ${g.name} \``),
   { context: user.userId },
  )
  .then((r) =>
   r
    .flat()
    .filter((s): s is string => !!s)
    .join('\n'),
  );

 const err = await msg.client.util.request.channels.editMessage(
  channel.guild,
  user.threadId,
  user.infoId,
  { content: mutuals?.length ? mutuals : 'Uncached' },
 );
 if ('message' in err) throw new Error(err.message);

 if (msg.content.length || msg.embeds.length || msg.attachments.size) {
  await msg.client.util.request.webhooks.execute(
   channel.guild,
   process.env.dmWebhookId ?? '',
   process.env.dmWebhookToken ?? '',
   {
    ...(await makePayload(msg)),
    wait: false,
    thread_id: user.threadId,
   },
  );
 }

 if (msg.poll) {
  msg.client.util.request.webhooks.execute(
   channel.guild,
   process.env.dmWebhookId ?? '',
   process.env.dmWebhookToken ?? '',
   {
    embeds: [
     {
      description: msg.poll.question.text,
      fields: [
       {
        name: 'Answers',
        value: msg.poll.answers.map((a) => `${a.emoji ?? 'None'} - ${a.text}`).join('\n'),
       },
      ],
      color: Colors.Ephemeral,
     },
    ],
    wait: false,
    thread_id: user.threadId,
    username: msg.author.username,
    avatar_url: msg.author.displayAvatarURL(),
   },
  );
 }

 if (msg.stickers.size) {
  msg.client.util.request.webhooks.execute(
   channel.guild,
   process.env.dmWebhookId ?? '',
   process.env.dmWebhookToken ?? '',
   {
    embeds: msg.stickers.map((s) => ({
     thumbnail: { url: msg.client.util.constants.standard.stickerURL(s) },
     description: `${s.tags} - ${s.description ?? 'None'}`,
     color: Colors.Ephemeral,
     title: s.name,
    })),
    wait: false,
    thread_id: user.threadId,
    username: msg.author.username,
    avatar_url: msg.author.displayAvatarURL(),
   },
  );
 }
};

const createDMLog = async (user: Discord.User, channel: Discord.GuildTextBasedChannel) => {
 const log = await channel.client.util.request.channels.createThread(
  channel as Discord.GuildTextBasedChannel,
  {
   name: user.id,
   auto_archive_duration: Discord.ThreadAutoArchiveDuration.OneHour,
   invitable: false,
   type: Discord.ChannelType.PublicThread,
  },
 );
 if ('message' in log) return log;

 const info = await user.client.util.request.channels.sendMessage(
  channel.guild,
  log.id,
  { content: 'Info' },
  user.client,
 );
 if ('message' in info) return info;

 await user.client.util.DataBase.dmLog.create({
  data: {
   userId: user.id,
   threadId: log.id,
   infoId: info.id,
  },
 });

 return { userId: user.id, threadId: log.id, infoId: info.id };
};

export const makePayload = async (msg: Discord.Message) => ({
 allowed_mentions: { users: [], roles: [] },
 content: msg.content,
 username: msg.author.username,
 avatar_url: msg.author.displayAvatarURL(),
 embeds: msg.embeds.map((e) => e.data).filter((e) => !('provider' in e)),
 files: (await msg.client.util.fileURL2Buffer(msg.attachments.map((o) => o.url)))
  ?.filter((a): a is Discord.AttachmentPayload => !!a)
  .map((attachment) => ({
   data: attachment.attachment as Buffer,
   name: attachment.name ?? 'attachment',
   description: attachment.description,
  })),
});
