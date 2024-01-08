import client from '../../../BaseClient/Client.js';

export default async () => {
 const settings = await client.util.DataBase.guildsettings.findMany({
  where: {
   token: { not: null },
  },
 });

 settings.forEach((s) => {
  client.util.requestHandler(s.guildid, s.token as string);
 });
};
