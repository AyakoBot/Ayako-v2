import * as os from 'os';
import util from 'util';
import waveform from 'waveform-data';
import fetch from 'node-fetch';
import * as Discord from 'discord.js';
import auth from '../../../auth.json' assert { type: 'json' };
import * as ch from '../../../BaseClient/ClientHelper.js';

// eslint-disable-next-line no-unused-expressions
Discord.APIVersion;
// eslint-disable-next-line no-unused-expressions
fetch.name;
// eslint-disable-next-line no-unused-expressions
os.arch;
// eslint-disable-next-line no-unused-expressions
waveform;

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
   ch.replyMsg(msg, { files: [ch.txtFileWriter(clean(evaled))] });
   log(clean(evaled));
   return;
  }
  if (clean(evaled) !== '"undefined"') {
   ch.replyMsg(msg, { content: `\n${ch.util.makeCodeBlock(`js\n${clean(evaled)}`)}` });
   log(clean(evaled));
   return;
  }

  if (msg.inGuild()) {
   ch.request.channels.addReaction(msg, `${ch.emotes.cross.name}:${ch.emotes.cross.id}`);
  } else msg.react(ch.emotes.cross.id);
 } catch (err) {
  if (clean(err).length > 2000) {
   ch.replyMsg(msg, { files: [ch.txtFileWriter(clean(err))] });
   log(clean(err));
   return;
  }

  if (clean(err) !== '"undefined"') {
   ch.replyMsg(msg, {
    content: `\`ERROR\` \n${ch.util.makeCodeBlock(`js\n${clean((err as Error).message)}`)}\n`,
   });
   log(clean(err));
   return;
  }

  if (msg.inGuild()) {
   ch.request.channels.addReaction(msg, `${ch.emotes.cross.name}:${ch.emotes.cross.id}`);
  } else msg.react(ch.emotes.cross.id);
 }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clean = (text: unknown): any =>
 JSON.parse(
  JSON.stringify(text, null, 2)
   .replace(/`/g, `\`${String.fromCharCode(8203)}`)
   .replace(/@/g, `@${String.fromCharCode(8203)}`)
   .replace(reg, 'TOKEN'),
 );
