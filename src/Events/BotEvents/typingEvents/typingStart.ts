import type * as Discord from 'discord.js';

export default async (typing: Discord.Typing) => {
 if (!typing.inGuild()) return;

 typing.client.util.importCache.Events.BotEvents.typingEvents.log.file.default(typing);
};
