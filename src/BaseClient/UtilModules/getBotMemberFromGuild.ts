import * as Discord from 'discord.js';
import { guild as getBotIdFromGuild } from './getBotIdFrom.js';

/**
 * Retrieves the custom bot member from the given guild.
 * @param guild - The guild to retrieve the custom bot member from.
 * @returns A Promise that resolves with the custom bot member.
 */
export default async (guild: Discord.Guild) =>
 guild.members.cache.get(await getBotIdFromGuild(guild)) ?? guild.members.me!;
