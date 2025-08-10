import type * as Discord from 'discord.js';

import commandHandler from '../messageCreate/commandHandler.js';
import dmLog from '../messageCreate/dmLog.js';
import log from './log.js';
import newlines from '../messageCreate/newlines.js';
import invites from '../messageCreate/invites.js';
import antivirus from '../messageCreate/antivirus.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
 if (!msg.inGuild()) {
  dmLog(msg);
  return;
 }

 newlines(msg);
 invites(msg);
 antivirus(msg);

 log(oldMsg, msg);
 commandHandler(msg);
};
