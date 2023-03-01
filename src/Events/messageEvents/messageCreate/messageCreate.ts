import type * as Discord from 'discord.js';
import stringEmotes from '../../../BaseClient/ClientHelperModules/stringEmotes.js';

import commandHandler from './commandHandler.js';
//import antivirus from './antivirus.js';
//import disboard from './disboard.js';
import other from './other.js';
//import leveling from './leveling.js';
import afk from './afk.js';
//import blacklist from './blacklist.js';
import revengePing from './revengePing.js';
import sticky from './sticky.js';

//import dmLog from './dmLog.js';

export default async (msg: Discord.Message) => {
  if (!msg) return;
  if (!msg.author) return;

  memix(msg);

  //antivirus(msg);

  if (msg.inGuild()) {
    commandHandler(msg);
    //disboard(msg);
    other(msg);
    //leveling(msg);
    afk(msg);
    //blacklist(msg);
    revengePing(msg);
    sticky(msg);
  } else {
    //dmLog(msg);
  }
};

const memix = (msg: Discord.Message) => {
  if (msg.channel.id !== '1077576079281229845') return;
  if (msg.author.id !== '1050732083254923274') {
    msg.delete();
    return;
  }

  msg.react(stringEmotes.up);
};
