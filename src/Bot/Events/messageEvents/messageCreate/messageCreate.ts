import type DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';

export default async (client: CT.Client, m: DDeno.Message) => {
  if (!m) return;

  const msg = (await convertMsg(client, m)) as CT.Message;

  const files: { default: (t: CT.Message) => void }[] = await Promise.all(
    (await getPaths(client, msg)).map((p) => import(p)),
  );
  files.forEach((f) => f.default(msg));
};

const getPaths = async (client: CT.Client, msg: CT.Message) => {
  if ((await client.cache.users.get(msg.authorId))?.discriminator === '0000') return ['./ashes.js'];

  const paths = [
    //  './commandHandler.js',
    //  './other.js',
    //  './antivirus.js',
  ];

  if (msg.guildId) {
    paths.push(
      //  './disboard.js',
      //  './leveling.js',
      './afk.js',
      //  './blacklist.js',
      //  './willis.js',
      './revengePing.js',
    );

    if (!msg.editedTimestamp) {
      const row = await client.ch
        .query('SELECT * FROM stats;')
        .then((r: DBT.stats[] | null) => (r ? r[0] : null));

      if (row?.antispam === true) paths.push('./antispam.js');
    }
  } else paths.push('./DMlog.js');

  return paths;
};

const convertMsg = async (client: CT.Client, m: DDeno.Message): Promise<CT.Message> => {
  const msg = m as CT.Message;
  const fetchArray: (
    | Promise<DDeno.User | undefined>
    | Promise<DDeno.Channel | undefined>
    | Promise<DDeno.Guild | undefined>
  )[] = [client.cache.channels.get(m.channelId, m.guildId), client.cache.users.get(m.authorId)];

  if (msg.guildId) fetchArray.push(client.cache.guilds.get(msg.guildId));

  const [channel, author, guild] = await Promise.all(fetchArray);
  msg.channel = channel;
  msg.author = author;
  msg.guild = guild;

  return msg;
};
