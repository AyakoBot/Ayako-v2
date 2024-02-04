import client from '../../../../BaseClient/Bot/Client.js';

export default async () => {
 const settings = await client.util.DataBase.roleseparatorsettings.findMany({
  where: { stillrunning: true },
 });

 settings.forEach((s) => {
  const guild = client.guilds.cache.get(s.guildid);
  if (!guild) return;

  client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.separator.file.oneTimeRunner(
   undefined,
   guild,
  );
 });
};
