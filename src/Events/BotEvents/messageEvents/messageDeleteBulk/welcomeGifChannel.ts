import type { Collection, GuildTextBasedChannel, Message, Snowflake } from 'discord.js';

export default async (msgs: Collection<Snowflake, Message>, channel: GuildTextBasedChannel) => {
 channel.client.util.DataBase.welcomeGIF
  .deleteMany({
   where: { channelId: channel.id, msgId: { in: msgs.map((m) => m.id) } },
  })
  .then();
};
