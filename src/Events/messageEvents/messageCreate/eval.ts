// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fetch from 'node-fetch';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as os from 'os';

import * as Discord from 'discord.js';
import util from 'util';
import auth from '../../../auth.json' assert { type: 'json' };
import * as ch from '../../../BaseClient/ClientHelper.js';

const reg = new RegExp(auth.token, 'g');

// eslint-disable-next-line no-console
const { log } = console;

export default async (msg: Discord.Message) => {
 if (msg.author.id !== auth.ownerID) return;
 if (!msg.content.startsWith('eval')) return;

 const args = msg.content.split(/\s+/g);
 args.shift();
 const code = `${args.slice(0).join(' ')}`;

 try {
  // eslint-disable-next-line no-eval
  let evaled = code.includes('await') ? await eval(`(async () => {${code}})()`) : eval(code);
  if (typeof evaled !== 'string') evaled = util.inspect(evaled);

  if (evaled.length > 2000) {
   ch.replyMsg(msg, { content: 'Too long, check console' });
   log(evaled);
   return;
  }
  if (clean(evaled) !== 'undefined') {
   ch.replyMsg(msg, { content: `\n${ch.util.makeCodeBlock(`q\n${clean(evaled)}`)}` });
   log(evaled);
   return;
  }

  msg.react(ch.objectEmotes.cross.id);
 } catch (err) {
  if (JSON.stringify(err as Error).length > 2000) {
   ch.replyMsg(msg, { content: 'Too long, check console' });
   log(err);
   return;
  }

  if (clean(JSON.stringify(err)) !== 'undefined') {
   ch.replyMsg(msg, {
    content: `\`ERROR\` \n${ch.util.makeCodeBlock(`q\n${clean((err as Error).message)}`)}\n`,
   });
   log(err);
   return;
  }

  msg.react(ch.objectEmotes.cross.id);
 }
};

const clean = (text: string) =>
 typeof text === 'string'
  ? text
     .replace(/`/g, `\`${String.fromCharCode(8203)}`)
     .replace(/@/g, `@${String.fromCharCode(8203)}`)
     .replace(reg, 'TOKEN')
  : text;
