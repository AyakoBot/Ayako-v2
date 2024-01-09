import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../BaseClient/Client.js';

export default async () => {
 const settings = await client.util.DataBase.roleseparatorsettings.findMany({
  where: { startat: { lt: Date.now() - 3900000 } },
 });

 settings.forEach((s) => {
  client.cluster?.broadcastEval(
   async (cl, { guildid, channelid, messageid }) => {
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

    const channel = channelid ? await cl.util.getChannel.guildTextChannel(channelid) : undefined;
    const message =
     messageid && channel
      ? await cl.util.request.channels
         .getMessage(channel, messageid)
         .then((m) => ('message' in m ? undefined : m))
      : undefined;

    Jobs.scheduleJob(new Date(Date.now() + 300000), () => {
     cl.util.files['/Events/guildEvents/guildMemberUpdate/separator.js'].oneTimeRunner(
      message ?? {
       guild,
       author: cl.user as Discord.User,
       channel,
       id: messageid,
      },
      {},
     );
    });
   },
   { context: s },
  );
 });
};
