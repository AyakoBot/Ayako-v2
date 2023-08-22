import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

export interface Webhooks {
 get: (
  webhookId: string,
  channelId: string,
  guild: Discord.Guild,
 ) => Promise<Discord.Webhook | undefined>;
 set: (webhook: Discord.Webhook) => void;
 find: (webhookId: string) => Discord.Webhook | undefined;
 delete: (webhookId: string) => void;
 cache: Map<string, Map<string, Map<string, Discord.Webhook>>>;
}

const self: Webhooks = {
 get: async (id, channelId, guild) => {
  const cached = self.cache.get(guild.id)?.get(channelId)?.get(id);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getWebhooks(guild);
  if ('message' in fetched) {
   error(guild, new Error(`Couldnt get Guild Webhooks`));
   return undefined;
  }

  fetched?.forEach((f) => self.set(new Classes.Webhook(guild.client, f)));

  return self.cache.get(guild.id)?.get(channelId)?.get(id);
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
