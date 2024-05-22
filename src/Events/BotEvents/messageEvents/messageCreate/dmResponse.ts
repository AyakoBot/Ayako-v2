import * as Discord from 'discord.js';
import { makePayload } from './dmLog.js';

export default async (msg: Discord.Message<true>) => {
 if (msg.author.id !== process.env.ownerID) return;
 if (!msg.channel.isThread()) return;

 const dbUser = await msg.client.util.DataBase.dmLog.findFirst({
  where: { threadId: msg.channel.id },
 });
 if (!dbUser) return;

 const dm = await msg.client.util.request.users.createDM(undefined, dbUser.userId, msg.client);
 if ('message' in dm) {
  msg.client.util.errorMsg(msg, dm.message, await msg.client.util.getLanguage('en-GB'));
  return;
 }

 const m = await msg.client.util.request.channels.sendMessage(
  undefined,
  dm.id,
  { ...(await makePayload(msg)) },
  msg.client,
 );

 if (!('message' in m)) return;
 msg.client.util.errorMsg(msg, m.message, await msg.client.util.getLanguage('en-GB'));
};
