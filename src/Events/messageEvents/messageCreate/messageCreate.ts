import type * as Discord from 'discord.js';
import stringEmotes from '../../../BaseClient/ClientHelperModules/stringEmotes.js';

import other from './other.js';
import revengePing from './revengePing.js';

//import dmLog from './dmLog.js';

export default async (msg: Discord.Message) => {
  if (!msg) return;
  if (!msg.author) return;

  willis(msg);

  if (msg.inGuild()) {
    other(msg);
    revengePing(msg);
  } else {
    //dmLog(msg);
  }
};

const willis = (msg: Discord.Message) => {
  if (msg.channel.id !== '1085592754781945877') return;
  if (msg.attachments.size) {
    msg.react(stringEmotes.up);
    return;
  }

  msg.delete();
};
