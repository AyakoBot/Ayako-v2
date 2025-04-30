import type { Guild } from 'src/Typings/Typings.js';
import { cache } from '../Bot/Redis';
import { guild as getBotIdFromGuild } from './getBotIdFrom';

/**
 * Retrieves the custom bot member from the given guild.
 * @param guild - The guild to retrieve the custom bot member from.
 * @returns A Promise that resolves with the custom bot member.
 */
export default async (guild: Guild | string) => ({
 ...cache.members.get(typeof guild === 'string' ? guild : guild.id, await getBotIdFromGuild(guild)),
 user: cache.users.get(await getBotIdFromGuild(guild)),
});
