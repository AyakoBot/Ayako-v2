import * as Discord from 'discord.js';

/**
 * Represents a cache for Discord invites.
 */
export interface Invites {
 /**
  * Retrieves an invite from the cache.
  * @param code - The code of the invite to retrieve.
  * @param channelId - The ID of the channel where the invite was created.
  * @param guild - The guild where the invite was created.
  * @returns A Promise that resolves with the retrieved invite, or undefined if it was not found.
  */
 get: (
  code: string,
  channelId: string,
  guild: Discord.Guild,
 ) => Promise<Discord.Invite | undefined>;

 /**
  * Adds an invite to the cache.
  * @param invite - The invite to add to the cache.
  * @param guildId - The ID of the guild where the invite was created.
  */
 set: (invite: Discord.Invite, guildId: string) => void;

 /**
  * Finds an invite in the cache.
  * @param code - The code of the invite to find.
  * @returns The found invite, or undefined if it was not found.
  */
 find: (code: string) => Discord.Invite | undefined;

 /**
  * Deletes an invite from the cache.
  * @param code - The code of the invite to delete.
  * @param guildId - The ID of the guild where the invite was created.
  * @param channelId - The ID of the channel where the invite was created.
  */
 delete: (code: string, guildId: string, channelId: string) => void;

 /**
  * The cache of invites, organized by guild ID, channel ID, and invite code.
  */
 cache: Map<string, Map<string, Map<string, Discord.Invite>>>;
}

const self: Invites = {
 get: async (code, channelId, guild) => {
  const cached = self.cache.get(guild.id)?.get(channelId)?.get(code);
  if (cached) return cached;

  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getInvites(guild);
  if ('message' in fetched) return undefined;

  fetched?.forEach((f) => {
   self.set(f, guild.id);
  });

  self.cache.get(guild.id)?.clear();

  return fetched.find((f) => f.code === code);
 },
 set: (invite, guildId) => {
  if (!invite.channelId) {
   // eslint-disable-next-line no-console
   console.error('Invite without channel ID found!', invite);
   return;
  }

  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(invite.channelId)) {
   self.cache.get(guildId)?.set(invite.channelId, new Map());
  }

  self.cache.get(guildId)?.get(invite.channelId)?.set(invite.code, invite);
 },
 find: (code) =>
  Array.from(self.cache, ([, g]) => g)
   .map((c) => Array.from(c, ([, i]) => i))
   .flat()
   .find((c) => c.get(code))
   ?.get(code),
 delete: (code, guildId, channelId) => {
  const cached = self.find(code);
  if (!cached || !channelId) return;

  if (self.cache.get(guildId)?.size === 1) {
   if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
    self.cache.get(guildId)?.get(channelId)?.clear();
   } else {
    self.cache.get(guildId)?.get(channelId)?.delete(code);
   }
  } else if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
   self.cache.get(guildId)?.delete(channelId);
  } else {
   self.cache.get(guildId)?.get(channelId)?.delete(code);
  }
 },
 cache: new Map(),
};

export default self;
