import type { ButtonInteraction } from 'discord.js';
import redis from '../../../BaseClient/Bot/Redis.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const roleId = args.shift();
 const mentioner = args.shift();

 if (!cmd.member.roles.cache.has(roleId!) && cmd.user.id !== mentioner) {
  cmd.client.util.notYours(cmd, await cmd.client.util.getLanguage(cmd.guildId));
  return;
 }

 cmd.client.util.request.channels.deleteMessage(cmd.message);
 redis.expire(
  `${cmd.client.util.scheduleManager.prefix}:votePunish:expire:${cmd.guild.id}:${cmd.channel!.id}`,
  1,
 );
 cmd.client.util.scheduleManager.delScheduled(`votePunish:execute:${cmd.guildId}:${roleId}`);
};
