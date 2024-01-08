import * as Discord from 'discord.js';

/**
 * Represents a cache for Discord invite guilds.
 */
export interface InviteGuilds {
 /**
  * Retrieves the invite guild with the specified ID from the cache.
  * @param guildId The ID of the invite guild to retrieve.
  * @returns The invite guild, or undefined if it is not in the cache.
  */
 get: (guildId: string) => Discord.InviteGuild | undefined;

 /**
  * Adds or updates the invite guild with the specified ID in the cache.
  * @param guildId The ID of the invite guild to add or update.
  * @param inviteGuild The invite guild to add or update.
  */
 set: (guildId: string, inviteGuild: Discord.InviteGuild) => void;

 /**
  * Removes the invite guild with the specified ID from the cache.
  * @param guildId The ID of the invite guild to remove.
  */
 delete: (guildId: string) => void;

 /**
  * The underlying map that stores the invite guilds in the cache.
  */
 cache: Map<string, Discord.InviteGuild>;
}

const self: InviteGuilds = {
 get: (id) => self.cache.get(id),
 set: (id, guild) => self.cache.set(id, guild),
 delete: (id) => {
  self.cache.delete(id);
 },
 cache: new Map(),
};

export default self;
