import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

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

 const message = await msg.channel.messages.fetch(stickyMessage.lastmsgid).catch(() => undefined);

 if (!message) {
  ch.DataBase.stickymessages
   .delete({
    where: { guildid: msg.guildId, channelid: msg.channelId },
   })
   .then();

  return;
 }

 const language = await ch.languageSelector(msg.guildId);
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

   const m = webhook
    ? await webhook.send({
       username: user?.bot ? user.username : user?.displayName ?? msg.client.user.username,
       avatarURL: user?.displayAvatarURL() ?? msg.client.user.displayAvatarURL(),
       ...payload,
      })
    : await ch.send(msg.channel, payload);

   if (!m) return;
   if (webhook && message.author.id === webhook.id) webhook.deleteMessage(message);
   else if (message.deletable) message.delete().catch(() => undefined);

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
