import * as Discord from 'discord.js';

export default async (
 reaction: Discord.MessageReaction,
 user: Discord.User,
 msg: Discord.Message<true>,
) => {
 if (user.bot) return;
 if (reaction.emoji.id !== msg.client.util.emotes.levelupemotes[1].id) return;

 const member = await msg.guild.members.fetch(user.id).catch(() => undefined);
 if (!member) return;

 const pipeline = msg.client.util.scheduleManager.redis.pipeline();
 member.roles.cache.map((role) =>
  msg.client.util.scheduleManager.delScheduled(
   `votePunish:init:${msg.guildId}:${role.id}:${msg.channelId}`,
   pipeline,
  ),
 );
 pipeline.exec();
};
