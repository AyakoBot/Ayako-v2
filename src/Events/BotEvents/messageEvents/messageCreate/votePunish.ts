import type { Message } from 'discord.js';

export default async (msg: Message) => {
 if (!msg.inGuild()) return;
 if (msg.author?.bot) return;

 const pipeline = msg.client.util.scheduleManager.redis.pipeline();
 msg.member?.roles.cache.map((role) =>
  msg.client.util.scheduleManager.delScheduled(
   `votePunish:init:${msg.guildId}:${role.id}:${msg.channelId}`,
   pipeline,
  ),
 );
 pipeline.exec();

 if (!msg.mentions.roles.size) return;

 const settings = await msg.client.util.DataBase.votePunish.findFirst({
  where: {
   active: true,
   guildid: msg.guildId,
   roleId: { in: msg.mentions.roles.map((r) => r.id) },
   OR: [
    { channelIds: { isEmpty: true } },
    { channelIds: { has: msg.channelId } },
    { channelIds: { has: msg.channel.parentId } },
   ],
  },
 });
 if (!settings) return;

 if (settings.bluserid.includes(msg.author.id)) return;
 if (settings.blroleid.find((r) => msg.member?.roles.cache.has(r))) return;
 if (
  settings.voteInitRoles.length &&
  !settings.voteInitRoles.find((r) => msg.member?.roles.cache.has(r))
 ) {
  return;
 }

 if (await msg.client.util.getRatelimit(`votePunish:${settings.roleId}`)) return;
 msg.client.util.setRatelimit(`votePunish:${settings.roleId}`, Number(settings.cooldown));

 msg.client.util.scheduleManager.setScheduled(
  `votePunish:init:${msg.guildId}:${settings.roleId}:${msg.channelId}`,
  JSON.stringify({
   id: Number(settings.uniquetimestamp),
   guildId: msg.guildId,
   userId: msg.author.id,
   channelId: msg.channelId,
  }),
  Math.abs(Number(settings.cooldown)),
 );

 msg.client.util.request.channels.addReaction(
  msg,
  msg.client.util.constants.standard.getEmoteIdentifier(msg.client.util.emotes.levelupemotes[1]),
 );
};
