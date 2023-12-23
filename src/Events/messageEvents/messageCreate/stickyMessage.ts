import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.id === msg.client.user.id) return;
 if (msg.author.discriminator === '0000' && msg.author.bot) return;

 const stickyMessage = await ch.DataBase.stickymessages.findUnique({
  where: {
   guildid: msg.guildId,
   channelid: msg.channelId,
  },
 });

 if (!stickyMessage) return;

 const message = await ch.request.channels
  .getMessage(msg.channel, stickyMessage.lastmsgid)
  .then((m) => ('message' in m ? undefined : m));

 if (!message) {
  ch.DataBase.stickymessages
   .delete({
    where: { guildid: msg.guildId, channelid: msg.channelId },
   })
   .then();

  return;
 }

 const language = await ch.getLanguage(msg.guildId);
 const lan = language.contextCommands.message['Stick Message'];

 ch.cache.stickyTimeouts.delete(msg.channelId);
 ch.cache.stickyTimeouts.set(
  msg.channelId,
  Jobs.scheduleJob(new Date(Date.now() + 60000), async () => {
   const webhook = await ch.getChannelWebhook(msg.channel);
   if (!webhook) ch.error(msg.guild, new Error('Webhook to post Message with not found'));

   const user = msg.client.users.cache.get(stickyMessage.userid);
   if (!user) ch.error(msg.guild, new Error('User to post Message as not found'));

   const payload: CT.UsualMessagePayload = {
    content: message.content,
    embeds: message.embeds.map((e) => e.data) as Discord.APIEmbed[],
    files: message.attachments.map((a) => a),
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
     ? await ch.request.webhooks.execute(msg.guild, webhook.id, webhook.token, {
        username: user?.bot ? user.username : user?.displayName ?? msg.client.user.username,
        avatar_url: user?.displayAvatarURL() ?? msg.client.user.displayAvatarURL(),
        ...(payload as Omit<CT.UsualMessagePayload, 'files'>),
       })
     : await ch.send(msg.channel, payload);

   if (!m) return;

   if ('message' in m) {
    ch.error(msg.guild, new Error(m.message));
    return;
   }

   if (webhook && message.author.id === webhook.id && webhook.token) {
    ch.request.webhooks.deleteMessage(msg.guild, webhook.id, webhook.token, message.id);
   } else if (await ch.isDeleteable(message)) ch.request.channels.deleteMessage(message);

   ch.DataBase.stickymessages
    .update({
     where: {
      guildid: msg.guildId,
      channelid: msg.channelId,
     },
     data: {
      lastmsgid: m.id,
     },
    })
    .then();
  }),
 );
};
