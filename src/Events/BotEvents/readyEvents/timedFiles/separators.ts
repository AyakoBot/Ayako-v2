import client from '../../../../BaseClient/Bot/Client.js';
import * as separator from '../../guildEvents/guildMemberUpdate/separator.js';

export default async () => {
 const settings = await client.util.DataBase.roleseparatorsettings.findMany({
  where: { startat: { lt: Date.now() - 3900000 } },
 });

 settings.forEach((s) => {
  const guild = client.guilds.cache.get(s.guildid);
  if (!guild) return;

  client.util.cache.separatorAssigner.get(guild.id)?.forEach((job) => {
   job?.cancel();
  });

  client.util.cache.separatorAssigner.delete(guild.id);

  client.util.files.jobs.scheduleJob(new Date(Date.now() + 300000), () => {
   separator.oneTimeRunner(undefined, guild);
  });
 });
};
