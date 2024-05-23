import * as Discord from 'discord.js';

export default async (msg: Discord.Message) => {
 if (msg.author.id !== process.env.ownerId) return;
 if (!msg.inGuild()) return;
 if (!msg.content.startsWith('tta')) return;

 msg.client.util.request.webhooks.execute(
  msg.guild,
  process.env.todoWebhookId ?? '',
  process.env.todoWebhookToken ?? '',
  {
   content: msg.content.slice(4),
  },
 );
};
