import * as Discord from 'discord.js';

/**
 * Interface for managing webhooks in cache.
 */
export interface Webhooks {
 /**
  * Retrieves a webhook from cache.
  * @param webhookId - The ID of the webhook to retrieve.
  * @param channelId - The ID of the channel the webhook belongs to.
  * @param guild - The guild the webhook belongs to.
  * @returns A Promise that resolves to the retrieved webhook,
  * or undefined if it does not exist in cache.
  */
 get: (
  webhookId: string,
  channelId: string,
  guild: Discord.Guild,
 ) => Promise<Discord.Webhook | undefined>;

 /**
  * Adds a webhook to cache.
  * @param webhook - The webhook to add to cache.
  */
 set: (webhook: Discord.Webhook) => void;

 /**
  * Finds a webhook in cache.
  * @param webhookId - The ID of the webhook to find.
  * @returns The found webhook, or undefined if it does not exist in cache.
  */
 find: (webhookId: string) => Discord.Webhook | undefined;

 /**
  * Deletes a webhook from cache.
  * @param webhookId - The ID of the webhook to delete.
  */
 delete: (webhookId: string) => void;

 /**
  * The cache of webhooks, organized by guild ID, channel ID, and webhook ID.
  */
 cache: Map<string, Map<string, Map<string, Discord.Webhook>>>;
}

const self: Webhooks = {
 get: async (id, channelId, guild) => {
  const cached = self.cache.get(guild.id)?.get(channelId)?.get(id);
  if (cached) return cached;

  const requestHandler =
   guild.client.util.files['/BaseClient/UtilModules/requestHandler.js'].request;
  const fetched = await requestHandler.guilds.getWebhooks(guild);
  if ('message' in fetched) return undefined;

  fetched?.forEach((f) => self.set(f));

  return fetched.find((f) => f.id === id);
 },
 set: (webhook) => {
  if (!self.cache.get(webhook.guildId)) {
   self.cache.set(webhook.guildId, new Map());
  }

  if (!self.cache.get(webhook.guildId)?.get(webhook.channelId)) {
   self.cache.get(webhook.guildId)?.set(webhook.channelId, new Map());
  }

  if (webhook.channelId) {
   self.cache.get(webhook.guildId)?.get(webhook.channelId)?.set(webhook.id, webhook);
  }
 },
 find: (id) =>
  Array.from(self.cache, ([, g]) => g)
   .map((c) => Array.from(c, ([, i]) => i))
   .flat()
   .find((c) => c.get(id))
   ?.get(id),
 delete: (id) => {
  const cached = self.find(id);
  if (!cached || !cached.guildId || !cached.channelId) return;

  if (self.cache.get(cached.guildId)?.size === 1) {
   if (self.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
    self.cache.get(cached.guildId)?.get(cached.channelId)?.clear();
   } else {
    self.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
   }
  } else if (self.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
   self.cache.get(cached.guildId)?.delete(cached.channelId);
  } else {
   self.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
  }
 },
 cache: new Map(),
};

export default self;
