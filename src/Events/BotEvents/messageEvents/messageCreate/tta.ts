import * as Discord from 'discord.js';

export default async (msg: Discord.Message) => {
 if (msg.author.id !== process.env.ownerID) return;
 if (!msg.content.startsWith('tta')) return;

 const webhook = await msg.client.fetchWebhook(
  process.env.todoWebhookID ?? '',
  process.env.todoWebhookToken ?? '',
 );

 webhook.send({ content: msg.content.slice(4) });
};
