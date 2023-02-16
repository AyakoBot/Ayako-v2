import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';

export default (msg: Discord.Message) => {
  if (!msg.inGuild()) return;

  Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
    ch.cache.giveaways.delete(msg.guildId, msg.channelId, msg.id);
    ch.query(`DELETE FROM stickymessages WHERE lastmsgid = $1;`, [msg.id]);
  });
};
