import type * as Discord from 'discord.js';
import log from './log.js';
//import editCommand from './editCommand.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
  log(oldMsg, msg);
  //editCommand(oldMsg, msg);
};
