import type CT from '../../../Typings/CustomTypings';
import { ch } from '../../../BaseClient/Client.js';

export default (msg: CT.GuildMessage) => {
  if (
    [
      '534783899331461123',
      '228182903140515841',
      '513413045251342336',
      '564052925828038658',
    ].includes(msg.author.id) &&
    msg.mentions.users.has('318453143476371456')
  ) {
    ch.replyMsg(msg, {
      content: `<@${msg.author.id}>`,
      allowedMentions: { users: [msg.author.id] },
    });
  }
};
