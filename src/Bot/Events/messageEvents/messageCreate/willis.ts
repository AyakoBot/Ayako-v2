import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default (msg: CT.MessageGuild) => {
  if (!msg.member) return;
  if (msg.channel.id !== 979811225212956722n) return;
  if (msg.member.roles.includes(293928278845030410n)) return;
  if (msg.member.roles.includes(278332463141355520n)) return;
  if (msg.attachments.length) return;

  client.helpers.deleteMessage(msg.channelId, msg.id).catch(() => null);
};
