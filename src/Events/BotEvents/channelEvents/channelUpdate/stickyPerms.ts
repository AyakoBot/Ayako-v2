import * as Discord from 'discord.js';

export default async (
 oldChannel: Discord.GuildChannel | undefined,
 channel: Discord.GuildChannel,
) => {
 Promise.all(
  channel.permissionOverwrites.cache
   .filter((o) => o.type === Discord.OverwriteType.Member)
   .filter((o) => o.deny.bitfield !== 0n || o.allow.bitfield !== 0n)
   .map((o) => ({
    userid: o.id,
    guildid: channel.guildId || channel.guild.id,
    channelid: channel.id,
    denybits: o.deny.bitfield,
    allowbits: o.allow.bitfield,
   }))
   .filter((d) => !!d.guildid)
   .map((data) =>
    channel.client.util.DataBase.stickypermmembers.upsert({
     where: { userid_channelid: { userid: data.userid, channelid: data.channelid } },
     create: data,
     update: data,
    }),
   ),
 ).then();

 Promise.all(
  channel.permissionOverwrites.cache
   .filter((o) => o.type === Discord.OverwriteType.Member)
   .filter((o) => o.deny.bitfield === 0n && o.allow.bitfield === 0n)
   .filter((o) => channel.guild.members.cache.has(o.id))
   .map((o) => o.id)
   .map((data) =>
    channel.client.util.DataBase.stickypermmembers.delete({
     where: { userid_channelid: { userid: data, channelid: channel.id } },
    }),
   ),
 ).then();

 const p3 = oldChannel?.permissionOverwrites.cache
  .filter((o) => o.type === Discord.OverwriteType.Member)
  .filter((o) => !channel.permissionOverwrites.cache.has(o.id))
  .filter((o) => channel.guild.members.cache.has(o.id))
  .map((o) =>
   channel.client.util.DataBase.stickypermmembers.delete({
    where: { userid_channelid: { userid: o.id, channelid: channel.id } },
   }),
  );

 if (p3) Promise.all(p3).then();
};
