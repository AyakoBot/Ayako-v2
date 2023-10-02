import type * as Discord from 'discord.js';

import other from './other.js';
import revengePing from './revengePing.js';
import _eval from './eval.js';
import execute from './execute.js';
import stickyMessage from './stickyMessage.js';
import commandHandler from './commandHandler.js';
import afk from './afk.js';
import levelling from './levelling.js';
import invites from './invites.js';
import newlines from './newlines.js';
import disboard from './disboard.js';
import antivirus from './antivirus.js';
import antispam from './antispam.js';

import dmLog from './dmLog.js';

export default async (msg: Discord.Message) => {
 if (!msg) return;
 if (!msg.author) return;

 _eval(msg);
 execute(msg);
 commandHandler(msg);

 if (msg.inGuild()) {
  other(msg);
  revengePing(msg);
  stickyMessage(msg);
  afk(msg);
  levelling(msg);
  invites(msg);
  newlines(msg);
  disboard(msg);
  antivirus(msg);
  antispam(msg);
 } else {
  dmLog(msg);
 }
};
