import type * as separator from '../../guildEvents/guildMemberUpdate/separator.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async () => {
 const settings = await ch.DataBase.roleseparatorsettings.findMany({
  where: { stillrunning: true },
 });

 settings.forEach((s) => {
  client.shard?.broadcastEval(
   async (cl, { guildid, channelid, messageid }) => {
    const guild = cl.guilds.cache.get(guildid);
    if (!guild) return;

    const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);
    const channel = channelid ? await chEval.getChannel.guildTextChannel(channelid) : undefined;
    const message =
     messageid && channel
      ? await chEval.request.channels
         .getMessage(channel, messageid)
         .then((m) => ('message' in m ? undefined : m))
      : undefined;

    const oTR: typeof separator = await import(
     `${process.cwd()}/Events/guildEvents/guildMemberUpdate/separator.js`
    );

    oTR.oneTimeRunner(
     message ?? {
      guild,
      author: cl.user,
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
