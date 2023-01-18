import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default (msg: CT.MessageGuild) => {
  if (
    [534783899331461123n, 228182903140515841n, 513413045251342336n, 564052925828038658n].includes(
      msg.authorId,
    ) &&
    msg.mentionedUserIds.includes(318453143476371456n)
  ) {
    client.ch.replyMsg(msg, {
      content: `<@${msg.authorId}>`,
      allowedMentions: { users: [msg.authorId] },
    });
  }
};
