import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { MessageCreateOptions } from '../../../BaseClient/ClientHelperModules/send.js';

export default async (msg: Discord.Message) => {
 if (!msg.inGuild()) return;
 if (msg.author.id === msg.client.user.id) return;
 if (msg.author.discriminator === '0000' && msg.author.bot) return;

 const stickyMessage = await ch.query(
  `SELECT * FROM stickymessages WHERE guildid = $1 AND channelid = $2;`,
  [msg.guildId, msg.channelId],
  {
   returnType: 'stickymessages',
   asArray: false,
  },
 );

 if (!stickyMessage) return;

 const message = await msg.channel.messages.fetch(stickyMessage.lastmsgid).catch(() => undefined);

 if (!message) {
  ch.query(`DELETE FROM stickymessages WHERE guildid = $1 AND channelid = $2;`, [
   msg.guildId,
   msg.channelId,
  ]);
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

   const payload: Discord.MessageCreateOptions = {
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
        customId: '-',
       },
      ],
     },
    ],
   };

   const m = webhook
    ? await webhook.send({
       username: user?.bot ? user.username : user?.username ?? msg.client.user.username,
       // TODO: user.globalName or displayName        ^
       avatarURL: user?.displayAvatarURL() ?? msg.client.user.displayAvatarURL(),
       ...payload,
      })
    : await ch.send(msg.channel, payload as MessageCreateOptions);

   if (!m) return;
   if (webhook && message.author.id === webhook.id) webhook.deleteMessage(message);
   else if (message.deletable) message.delete().catch(() => undefined);

   ch.query(`UPDATE stickymessages SET lastmsgid = $1 WHERE guildid = $2 AND channelid = $3;`, [
    m.id,
    msg.guildId,
    msg.channelId,
   ]);
  }),
 );
};
