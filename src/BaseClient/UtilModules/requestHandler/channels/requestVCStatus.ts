import * as Discord from 'discord.js';

/**
 * Requests the channel statuses of all voice channels of a guild.
 * The statuses are sent to the client as a `VOICE_CHANNEL_STATUS_UPDATE` event
 * via Raw gateway event.
 * @param guild - The guild request the voice channel statuses of.
 * @returns A promise that resolves to void
 */
export default async (guild: Discord.Guild) =>
 guild.client.ws.shards.get(guild.shardId)?.send({ op: 36, d: { guild_id: guild.id } });
