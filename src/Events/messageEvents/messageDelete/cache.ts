import * as Jobs from 'node-schedule';
import type CT from '../../../Typings/CustomTypings';
import { ch } from '../../../BaseClient/Client.js';

export default (msg: CT.GuildMessage) => {
  Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
    ch.cache.giveaways.delete(msg.guild.id, msg.channelId, msg.id);
    ch.query(`DELETE FROM stickymessages WHERE lastmsgid = $1;`, [msg.id]);
  });
};
