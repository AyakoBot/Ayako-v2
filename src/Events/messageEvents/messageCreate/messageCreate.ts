import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (m: DDeno.Message) => {
  if (!m) return;

  client.ch.cache.messages.set(m);

  const msg = (await convertMsg(m)) as CT.Message;
  const files: { default: (t: CT.Message) => void }[] = await Promise.all(
    getPaths(msg).map((p) => import(p)),
  );

  files.forEach((f) => f.default(msg));
};

const getPaths = (msg: CT.Message) => {
  if (msg.author.discriminator === '0000') return ['./ashes.js'];

  const paths = ['./commandHandler.js', './antivirus.js'];

  if ('guildId' in msg && msg.guild.id) {
    paths.push(
      './disboard.js',
      './other.js',
      './leveling.js',
      './afk.js',
      './blacklist.js',
      './willis.js',
      './revengePing.js',
      './antispam.js',
    );
  } else paths.push('./DMlog.js');

  return paths;
};

export const convertMsg = async (m: DDeno.Message): Promise<CT.Message> => {
  const msg = m as CT.Message;
  const fetchArray: (
    | Promise<DDeno.User | undefined>
    | Promise<DDeno.Channel | undefined>
    | Promise<DDeno.Guild | undefined>
    | Promise<DDeno.Member | undefined>
    | Promise<CT.Language>
  )[] = [
    m.guild.id
      ? client.ch.cache.channels.get(m.channelId, m.guild.id)
      : client.helpers.getDmChannel(m.authorId),
    client.users.cache.get(m.authorId),
    client.ch.languageSelector('guildId' in msg ? msg.guild.id : undefined),
  ];

  if ('guildId' in msg && msg.guild.id) {
    fetchArray.push(client.ch.cache.guilds.get(msg.guild.id));
    fetchArray.push(client.ch.cache.members.get(m.authorId, msg.guild.id));
  }

  const [channel, author, language, guild, member] = await Promise.all(fetchArray);
  msg.channel = channel as DDeno.Channel;
  msg.author = author as DDeno.User;
  msg.language = language as CT.Language;
  (msg as CT.MessageGuild).guild = guild as DDeno.Guild;
  (msg as CT.MessageGuild).member = member as DDeno.Member;

  return msg;
};
