import type { GuildMember } from 'discord.js';
import type { ModOptions, ModTypes } from 'src/Typings/Typings';

export default async (options: ModOptions<ModTypes>, member?: GuildMember, channelId?: string) => {
 if (!member) return;
 if (!channelId) return;

 const pipeline = options.guild.client.util.scheduleManager.redis.pipeline();
 member.roles.cache.map((role) => {
  options.guild.client.util.scheduleManager.delScheduled(
   `votePunish:init:${member.guild.id}:${role.id}:${channelId}`,
   pipeline,
  );
 });
 pipeline.exec();
};
