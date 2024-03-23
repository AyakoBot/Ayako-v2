import type * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

import afk from './afk.js';
import antispam from './antispam.js';
import antivirus from './antivirus.js';
import commandHandler from './commandHandler.js';
import customEmbedThread from './customEmbedThread.js';
import disboard from './disboard.js';
import _eval from './eval.js';
import invites from './invites.js';
import levelling from './levelling.js';
import newlines from './newlines.js';
import notificationThread from './notificationThread.js';
import other from './other.js';
import stickyMessage from './stickyMessage.js';
import tta from './tta.js';

import dmLog from './dmLog.js';

export default async (msg: Discord.Message) => {
 if (!msg) return;
 if (!msg.author) return;

 if (msg.inGuild()) {
  _eval(msg);
  other(msg);
  stickyMessage(msg);
  afk(msg);
  levelling(msg);
  newlines(msg);
  disboard(msg);
  antispam(msg);
  notificationThread(msg);
  customEmbedThread(msg);
 } else {
  dmLog(msg);
 }

 tta(msg);
 commandHandler(msg);
 filterFastMessages(msg);

 msg.client.util.files.importCache.execute.file.default(msg);
};

const filterFastMessages = (msg: Discord.Message) => {
 const inCache = msg.client.util.cache.fastMsgCache.has(msg.author.id);
 if (inCache) {
  msg.client.util.cache.fastMsgCache.get(msg.author.id)?.msgs.push(msg);
  return;
 }

 msg.client.util.cache.fastMsgCache.set(msg.author.id, {
  msgs: [msg],
  job: scheduleJob(getPathFromError(new Error(msg.author.id)), '*/5 * * * * *', () => {
   const message = msg.client.util.cache.fastMsgCache.get(msg.author.id)?.msgs.shift();
   if (message) {
    if (msg.inGuild()) invites(msg);
    antivirus(msg);
    return;
   }

   msg.client.util.cache.fastMsgCache.get(msg.author.id)?.job.cancel();
   msg.client.util.cache.fastMsgCache.delete(msg.author.id);
  }),
 });
};
