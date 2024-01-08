import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async () => {
 const settings = await client.util.DataBase.roleseparatorsettings.findMany({
  where: { stillrunning: true },
 });

 settings.forEach((s) => {
  client.cluster?.broadcastEval(
   async (cl, { guildid, channelid, messageid }) => {
    const guild = cl.guilds.cache.get(guildid);
    if (!guild) return;

    const channel = channelid ? await cl.util.getChannel.guildTextChannel(channelid) : undefined;
    const message =
     messageid && channel
      ? await cl.util.request.channels
         .getMessage(channel, messageid)
         .then((m) => ('message' in m ? undefined : m))
      : undefined;

    cl.util.files['/Events/guildEvents/guildMemberUpdate/separator.js'].oneTimeRunner(
     message ?? {
      guild,
      author: cl.user as Discord.User,
      channel,
      id: messageid,
     },
     {},
    );
   },
   { context: s },
  );
 });
};
