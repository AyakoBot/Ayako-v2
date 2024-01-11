import client from '../../../BaseClient/Client.js';

export default async () => {
 const settings = await client.util.DataBase.roleseparatorsettings.findMany({
  where: { stillrunning: true },
 });

 settings.forEach((s) => {
  client.cluster?.broadcastEval(
   async (cl, { guildid }) => {
    const guild = cl.guilds.cache.get(guildid);
    if (!guild) return;

    cl.util.files['/Events/guildEvents/guildMemberUpdate/separator.js'].oneTimeRunner(
     undefined,
     guild,
    );
   },
   { context: { guildid: s.guildid } },
  );
 });
};
