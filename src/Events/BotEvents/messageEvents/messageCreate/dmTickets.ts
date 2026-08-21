import type { GuildTextBasedChannel, Message } from 'discord.js';

export default async (msg: Message) => {
 if (!msg.author) return;
 if (msg.author.bot) return;

 const ticket = await msg.client.util.DataBase.dMTicket.findUnique({
  where: { dmId: msg.channel.id },
 });
 if (!ticket) return;

 msg.client.cluster?.broadcastEval(
  async (
   cl,
   {
    ticketChannelId,
    msgContent,
    msgAttachments,
    authorName,
    authorAvatar,
    msgId,
   }: {
    ticketChannelId: string;
    msgContent: string;
    msgAttachments: string[];
    authorName: string;
    authorAvatar: string;
    msgId: string;
   },
  ) => {
   const channel = cl.channels.cache.get(ticketChannelId) as GuildTextBasedChannel | undefined;
   if (!channel) return;

   cl.util.send(channel, {
    content: msgAttachments.join('\n'),
    embeds: [
     {
      description: msgContent,
      author: { name: authorName, icon_url: authorAvatar },
      footer: {
       text: `${await cl.util.getLanguage(channel.guild.id).then((l) => l.t.MessageID)}: ${msgId}`,
      },
     },
    ],
   });
  },
  {
   context: {
    ticketChannelId: ticket.channelId,
    msgContent: msg.content,
    msgAttachments: msg.attachments.map((a) => a.url),
    authorName: msg.author.username,
    authorAvatar: msg.author.displayAvatarURL(),
    msgId: msg.id,
   },
  },
 );
};
