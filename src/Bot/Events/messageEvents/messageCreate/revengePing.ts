import type DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default (msg: DDeno.Message) => {
  if (
    [534783899331461123n, 228182903140515841n, 513413045251342336n].includes(msg.authorId) &&
    msg.mentionedUserIds.includes(318453143476371456n)
  ) {
    client.ch.replyMsg(msg, {
      content: `<@${msg.authorId}>`,
      allowedMentions: { users: [msg.authorId] },
    });
  }
};
