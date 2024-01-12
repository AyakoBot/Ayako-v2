import client from '../../../BaseClient/Client.js';

export default async () => {
 const settings = await client.util.DataBase.roleseparatorsettings.findMany({
  where: { startat: { lt: Date.now() - 3900000 } },
 });

 settings.forEach((s) => {
  client.cluster?.broadcastEval(
   async (cl, { guildid }) => {
    const guild = cl.guilds.cache.get(guildid);
    if (!guild) return;

    cl.util.files['/Events/guildEvents/guildMemberUpdate/separator.js'].separatorAssigner
     .get(guild.id)
     ?.forEach((job) => {
      job.cancel();
     });

    cl.util.files['/Events/guildEvents/guildMemberUpdate/separator.js'].separatorAssigner.delete(
     guild.id,
    );

    client.util.files.jobs.scheduleJob(new Date(Date.now() + 300000), () => {
     cl.util.files['/Events/guildEvents/guildMemberUpdate/separator.js'].oneTimeRunner(
      undefined,
      guild,
     );
    });
   },
   { context: { guildid: s.guildid } },
  );
 });
};
