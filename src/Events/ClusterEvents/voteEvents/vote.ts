import client from '../../../BaseClient/Bot/Client.js';
import { type Message, MessageType } from '../../../Typings/Typings.js';

import voteBotCreate from './voteBotCreate.js';

export default async ({ data }: Message<MessageType.Vote>) => {
 const settings = await client.util.DataBase.votesettings.findMany({
  where: { token: data.authorization, active: true },
 });
 if (!settings.length) return;

 settings.forEach(async (s) => {
  const guild = client.guilds.cache.get(s.guildid);
  if (!guild) return;

  const user = await client.util.getUser(data.user);
  if (!user) return;

  const member = await client.util.request.guilds
   .getMember(guild, data.user)
   .then((m) => ('message' in m ? undefined : m));

  voteBotCreate(data, guild, user, member, {
   ...s,
   uniquetimestamp: new client.util.files.prisma.Decimal(s.uniquetimestamp),
   linkedid: s.linkedid ? new client.util.files.prisma.Decimal(s.linkedid) : null,
  });
 });
};
