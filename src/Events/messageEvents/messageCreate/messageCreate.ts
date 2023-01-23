import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (m: Discord.Message) => {
  if (!m) return;
  if (!m.author) return;

  const msg = (await convertMsg(m)) as CT.Message;
  const files: { default: (t: CT.Message) => void }[] = await Promise.all(
    getPaths(msg).map((p) => import(p)),
  );

  files.forEach((f) => f.default(msg));
};

const getPaths = (msg: CT.Message) => {
  //  if (msg.author.discriminator === '0000') return ['./ashes.js'];

  const paths = [
    './commandHandler.js',
    //    './antivirus.js'
  ];

  if (msg.guild) {
    paths.push(
      //      './disboard.js',
      //      './other.js',
      //      './leveling.js',
      //      './afk.js',
      //      './blacklist.js',
      //      './willis.js',
      './revengePing.js',
      //      './antispam.js',
    );
  } else paths.push('./DMlog.js');

  return paths;
};

export const convertMsg = async (m: Discord.Message): Promise<CT.Message> => {
  const msg = m as CT.Message;
  const fetchArray: Promise<CT.Language>[] = [
    client.ch.languageSelector('guildId' in msg ? msg.guild?.id : undefined),
  ];

  const [language] = await Promise.all(fetchArray);
  msg.language = language as CT.Language;

  return msg;
};
