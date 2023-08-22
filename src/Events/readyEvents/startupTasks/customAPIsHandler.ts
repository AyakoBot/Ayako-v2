import * as ch from '../../../BaseClient/ClientHelper.js';

export default async () => {
 const settings = await ch.DataBase.guildsettings.findMany({
  where: {
   token: { not: null },
  },
 });

 settings.forEach((s) => {
  ch.requestHandler(s.guildid, s.token as string);
 });
};
