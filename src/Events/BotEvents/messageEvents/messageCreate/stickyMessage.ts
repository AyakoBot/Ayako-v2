import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import { Stream } from 'stream';
import * as CT from '../../../../Typings/Typings.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.id === msg.client.user.id) return;
 if (msg.author.discriminator === '0000' && msg.author.bot) return;

 const stickyMessage = await msg.client.util.DataBase.stickymessages.findUnique({
  where: {
   guildid: msg.guildId,
   channelid: msg.channelId,
  },
 });

 if (!stickyMessage) return;

 const message = await msg.client.util.request.channels
  .getMessage(msg.channel, stickyMessage.lastmsgid)
  .then((m) => ('message' in m ? undefined : m));

 if (!message) {
  msg.client.util.DataBase.stickymessages
   .delete({
    where: { guildid: msg.guildId, channelid: msg.channelId },
   })
   .then();

  return;
 }

 const language = await msg.client.util.getLanguage(msg.guildId);
 const lan = language.contextCommands.message['Stick Message'];

 msg.client.util.cache.stickyTimeouts.delete(msg.channelId);
 msg.client.util.cache.stickyTimeouts.set(
  msg.channelId,
  stickyMessage.lastmsgid,
  Jobs.scheduleJob(new Date(Date.now() + 60000), async () => {
   const webhook = await msg.client.util.getChannelWebhook(msg.channel);
   if (!webhook) {
    msg.client.util.error(msg.guild, new Error('Webhook to post Message with not found'));
   }

   const user = msg.client.users.cache.get(stickyMessage.userid);
   if (!user) msg.client.util.error(msg.guild, new Error('User to post Message as not found'));

   const files = await msg.client.util.fileURL2Buffer(message.attachments.map((a) => a.url));

   const payload: CT.UsualMessagePayload = {
    content: message.content,
    embeds: message.embeds
     .filter((e) => !e.url || !message.content.includes(e.url))
     .map((e) => e.data) as Discord.APIEmbed[],
    files: message.attachments
     .map((a) => a)
     .map((a, i) =>
      files[i]
       ? {
          name: a.name,
          attachment: files[i].attachment,
          description: a.description ?? undefined,
         }
       : undefined,
     )
     .filter(
      (
       f,
      ): f is {
       name: string;
       attachment: Discord.BufferResolvable | Stream;
       description: string | undefined;
      } => !!f,
     ),
    components: [
     {
      type: Discord.ComponentType.ActionRow,
      components: [
       {
        label: lan.button,
        type: Discord.ComponentType.Button,
        style: Discord.ButtonStyle.Secondary,
        disabled: true,
        custom_id: '-',
       },
      ],
     },
    ],
   };

   const m =
    webhook && webhook.token
     ? await msg.client.util.request.webhooks.execute(msg.guild, webhook.id, webhook.token, {
        username: user?.bot ? user.username : user?.displayName ?? msg.client.user.username,
        avatar_url: user?.displayAvatarURL() ?? msg.client.user.displayAvatarURL(),
        ...(payload as Omit<CT.UsualMessagePayload, 'files'>),
       })
     : await msg.client.util.send(msg.channel, payload);

   if (!m) return;

   if ('message' in m) {
    msg.client.util.error(msg.guild, new Error(m.message));
    return;
   }

   if (webhook && message.author.id === webhook.id && webhook.token) {
    msg.client.util.request.webhooks.deleteMessage(
     msg.guild,
     webhook.id,
     webhook.token,
     message.id,
    );
   } else if (await msg.client.util.isDeleteable(message)) {
    msg.client.util.request.channels.deleteMessage(message);
   }

   msg.client.util.DataBase.stickymessages
    .update({
     where: { guildid: msg.guildId, channelid: msg.channelId },
     data: { lastmsgid: m.id },
    })
    .then();

   msg.client.util.cache.stickyTimeouts.delete(msg.channelId);
  }),
 );
};
