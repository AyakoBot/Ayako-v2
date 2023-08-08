import type * as Discord from 'discord.js';
import stringEmotes from '../../../BaseClient/ClientHelperModules/stringEmotes.js';

import other from './other.js';
import revengePing from './revengePing.js';
import _eval from './eval.js';
import execute from './execute.js';
import stickyMessage from './stickyMessage.js';
import commandHandler from './commandHandler.js';
import afk from './afk.js';
import levelling from './levelling.js';

import dmLog from './dmLog.js';

export default async (msg: Discord.Message) => {
 if (!msg) return;
 if (!msg.author) return;

 willis(msg);
 _eval(msg);
 execute(msg);
 commandHandler(msg);

 if (msg.inGuild()) {
  other(msg);
  revengePing(msg);
  stickyMessage(msg);
  afk(msg);
  levelling(msg);
  // eventDel(msg);
 } else {
  dmLog(msg);
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
