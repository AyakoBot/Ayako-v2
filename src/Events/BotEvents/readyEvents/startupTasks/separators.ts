import client from '../../../../BaseClient/Bot/Client.js';
import { oneTimeRunner } from '../../guildEvents/guildMemberUpdate/separator.js';

export default async () => {
 const settings = await client.util.DataBase.roleseparatorsettings.findMany({
  where: { stillrunning: true },
 });

 settings.forEach((s) => {
  const guild = client.guilds.cache.get(s.guildid);
  if (!guild) return;

  oneTimeRunner(undefined, guild);
 });
};
