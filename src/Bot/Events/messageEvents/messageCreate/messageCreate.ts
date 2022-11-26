import type DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
// import type DBT from '../../../Typings/DataBaseTypings';

export default async (client: CT.Client, m: DDeno.Message) => {
  if (!m) return;

  const msg = (await convertMsg(client, m)) as CT.Message;
  const files: { default: (t: CT.Message) => void }[] = await Promise.all(
    getPaths(msg).map((p) => import(p)),
  );

  files.forEach((f) => f.default(msg));
};

const getPaths = (msg: CT.Message) => {
  if (msg.author.discriminator === '0000') return ['./ashes.js'];

  const paths = [
    //  './commandHandler.js',
    './antivirus.js',
  ];

  if ('guildId' in msg && msg.guildId) {
    paths.push(
      './disboard.js',
      './other.js',
      './leveling.js',
      //  './afk.js',
      './blacklist.js',
      './willis.js',
      './revengePing.js',
    );

    //  if (!msg.editedTimestamp) {
    //       const row = await client.ch
    //   .query('SELECT * FROM stats;')
    //      .then((r: DBT.stats[] | null) => (r ? r[0] : null));
    //
    // if (row?.antispam === true) paths.push('./antispam.js');
    // }
  } else paths.push('./DMlog.js');

  return paths;
};

const convertMsg = async (client: CT.Client, m: DDeno.Message): Promise<CT.Message> => {
  const msg = m as CT.Message;
  const fetchArray: (
    | Promise<DDeno.User | undefined>
    | Promise<DDeno.Channel | undefined>
    | Promise<DDeno.Guild | undefined>
    | Promise<DDeno.Member | undefined>
    | Promise<CT.Language>
  )[] = [
    client.cache.channels.get(m.channelId, m.guildId),
    client.cache.users.get(m.authorId),
    client.ch.languageSelector('guildId' in msg ? msg.guildId : undefined),
  ];

  if ('guildId' in msg && msg.guildId) {
    fetchArray.push(client.cache.guilds.get(msg.guildId));
    fetchArray.push(client.cache.members.get(m.authorId, msg.guildId));
  }

  const [channel, author, language, guild, member] = await Promise.all(fetchArray);
  msg.channel = channel as DDeno.Channel;
  msg.author = author as DDeno.User;
  msg.language = language as CT.Language;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  msg.guild = guild as DDeno.Guild;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  msg.member = member as DDeno.Member;

  return msg;
};
