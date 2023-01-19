import type * as Discord from 'discord.js';
import type Jobs from 'node-schedule';
import client from '../Client.js';

const cache: {
  // Discord Cache
  invites: {
    get: (code: string, channelId: string, guildId: string) => Promise<Discord.Invite | undefined>;
    set: (invite: Discord.Invite, guildId: string) => void;
    find: (code: string) => Discord.Invite | undefined;
    delete: (code: string, guildId: string) => void;
    cache: Map<string, Map<string, Map<string, Discord.Invite>>>;
  };
  webhooks: {
    get: (
      webhookId: string,
      channelId: string,
      guildId: string,
    ) => Promise<Discord.Webhook | undefined>;
    set: (webhook: Discord.Webhook) => void;
    find: (webhookId: string) => Discord.Webhook | undefined;
    delete: (webhookId: string) => void;
    cache: Map<string, Map<string, Map<string, Discord.Webhook>>>;
  };
  integrations: {
    get: (integrationId: string, guildId: string) => Promise<Discord.Integration | undefined>;
    set: (integration: Discord.Integration, guildId: string) => void;
    find: (integrationId: string) => Discord.Integration | undefined;
    delete: (integrationId: string, guildId: string) => void;
    cache: Map<string, Map<string, Discord.Integration>>;
  };
  scheduledEventUsers: {
    add: (user: Discord.User, guildId: string, scheduledEventId: string) => void;
    remove: (user: Discord.User, guildId: string, scheduledEventId: string) => void;
    cache: Map<string, Map<string, Map<string, Discord.User>>>;
  };
  welcomeScreens: {
    get: (guildId: string) => Promise<Discord.WelcomeScreen | undefined>;
    set: (welcomeScreen: Discord.WelcomeScreen) => void;
    delete: (guildId: string) => void;
    cache: Map<string, Discord.WelcomeScreen>;
  };

  // Ayako Cache
  giveawayClaimTimeout: {
    set: (job: Jobs.Job, guildId: string, userId: string) => void;
    delete: (guildId: string, userId: string) => void;
    cache: Map<string, Map<string, Jobs.Job>>;
  };
  mutes: {
    set: (job: Jobs.Job, guildId: string, userId: string) => void;
    delete: (guildId: string, userId: string) => void;
    cache: Map<string, Map<string, Jobs.Job>>;
  };
  bans: {
    set: (job: Jobs.Job, guildId: string, userId: string) => void;
    delete: (guildId: string, userId: string) => void;
    cache: Map<string, Map<string, Jobs.Job>>;
  };
  channelBans: {
    set: (job: Jobs.Job, guildId: string, channelId: string, userId: string) => void;
    delete: (guildId: string, channelId: string, userId: string) => void;
    cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
  };
  reminders: {
    set: (job: Jobs.Job, userId: string, timestamp: number) => void;
    delete: (userId: string, timestamp: number) => void;
    cache: Map<string, Map<number, Jobs.Job>>;
  };
  disboardBumpReminders: {
    set: (job: Jobs.Job, guildId: string) => void;
    delete: (guildId: string) => void;
    cache: Map<string, Jobs.Job>;
  };
  verificationCodes: {
    set: (code: string, guildId: string, userId: string) => void;
    delete: (guildId: string, userId: string) => void;
    cache: Map<string, Map<string, string>>;
  };
  giveaways: {
    set: (job: Jobs.Job, guildId: string, channelId: string, msgId: string) => void;
    delete: (guildId: string, channelId: string, msgId: string) => void;
    cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
  };
} = {
  invites: {
    get: async (code, channelId, guildId) => {
      const cached = cache.invites.cache.get(guildId)?.get(channelId)?.get(code);
      if (cached) return cached;

      cache.invites.cache.get(guildId)?.clear();

      const fetched = await client.guilds.cache.get(guildId)?.invites.fetch();
      fetched?.forEach((f) => {
        cache.invites.set(f, guildId);
      });

      return fetched?.find((f) => f.code === code);
    },
    set: (invite, guildId) => {
      if (!invite.channelId) {
        // eslint-disable-next-line no-console
        console.error('Invite without channel ID found!', invite);
        return;
      }

      if (!cache.invites.cache.get(guildId)) {
        cache.invites.cache.set(guildId, new Map());
      }

      if (!cache.invites.cache.get(guildId)?.get(invite.channelId)) {
        cache.invites.cache.get(guildId)?.set(invite.channelId, new Map());
      }

      cache.invites.cache.get(guildId)?.get(invite.channelId)?.set(invite.code, invite);
    },
    find: (code) =>
      Array.from(cache.invites.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((c) => c.get(code))
        ?.get(code),
    delete: (code, guildId) => {
      const cached = cache.invites.find(code);
      if (!cached || !cached.channelId) return;

      if (cache.invites.cache.get(guildId)?.size === 1) {
        if (cache.invites.cache.get(guildId)?.get(cached.channelId)?.size === 1) {
          cache.invites.cache.get(guildId)?.get(cached.channelId)?.clear();
        } else {
          cache.invites.cache.get(guildId)?.get(cached.channelId)?.delete(code);
        }
      } else if (cache.invites.cache.get(guildId)?.get(cached.channelId)?.size === 1) {
        cache.invites.cache.get(guildId)?.delete(cached.channelId);
      } else {
        cache.invites.cache.get(guildId)?.get(cached.channelId)?.delete(code);
      }
    },
    cache: new Map(),
  },
  webhooks: {
    get: async (id, channelId, guildId) => {
      const cached = cache.webhooks.cache.get(guildId)?.get(channelId)?.get(id);
      if (cached) return cached;

      const fetched = await client.guilds.cache.get(guildId)?.fetchWebhooks();
      fetched?.forEach((f) => cache.webhooks.set(f));

      return fetched?.find((f) => f.id === id);
    },
    set: (webhook) => {
      if (!cache.webhooks.cache.get(webhook.guildId)?.get(webhook.channelId)) {
        cache.webhooks.cache.get(webhook.guildId)?.set(webhook.channelId, new Map());
      }

      if (webhook.channelId) {
        cache.webhooks.cache.get(webhook.guildId)?.get(webhook.channelId)?.set(webhook.id, webhook);
      }
    },
    find: (id) =>
      Array.from(cache.webhooks.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((c) => c.get(id))
        ?.get(id),
    delete: (id) => {
      const cached = cache.webhooks.find(id);
      if (!cached || !cached.guildId || !cached.channelId) return;

      if (cache.webhooks.cache.get(cached.guildId)?.size === 1) {
        if (cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
          cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.clear();
        } else {
          cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
        }
      } else if (cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
        cache.webhooks.cache.get(cached.guildId)?.delete(cached.channelId);
      } else {
        cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  integrations: {
    get: async (id, guildId) => {
      const cached = cache.integrations.cache.get(guildId)?.get(id);
      if (cached) return cached;

      const fetched = await client.guilds.cache.get(guildId)?.fetchIntegrations();
      fetched?.forEach((f) => cache.integrations.set(f, guildId));

      return fetched?.find((f) => f.id === id);
    },
    set: (integration, guildId) => {
      if (!cache.integrations.cache.get(guildId)) {
        cache.integrations.cache.set(guildId, new Map());
      }
      cache.integrations.cache.get(guildId)?.set(integration.id, integration);
    },
    find: (id) =>
      Array.from(cache.integrations.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id, guildId) => {
      const cached = cache.integrations.find(id);
      if (!cached) return;

      if (cache.integrations.cache.get(guildId)?.size === 1) {
        cache.integrations.cache.delete(guildId);
      } else {
        cache.integrations.cache.get(guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  scheduledEventUsers: {
    add: (user: Discord.User, guildId: string, eventId: string) => {
      if (!cache.scheduledEventUsers.cache.get(guildId)) {
        cache.scheduledEventUsers.cache.set(guildId, new Map());
      }

      if (!cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)) {
        cache.scheduledEventUsers.cache.get(guildId)?.set(eventId, new Map());
      }

      cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.set(user.id, user);
    },
    remove: (user: Discord.User, guildId: string, eventId: string) => {
      const cached = cache.scheduledEventUsers.cache.get(guildId);
      if (!cached) return;

      if (cache.scheduledEventUsers.cache.size < 2) {
        if (cache.scheduledEventUsers.cache.get(guildId)?.size === 1) {
          if (cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.size === 1) {
            cache.scheduledEventUsers.cache.clear();
          } else {
            cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.delete(user.id);
          }
        } else {
          cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.delete(user.id);
        }
      } else {
        cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.delete(user.id);
      }
    },
    cache: new Map(),
  },
  welcomeScreens: {
    get: async (guildId) => {
      const cached = cache.welcomeScreens.cache.get(guildId);
      if (cached) return cached;

      const fetched = await client.guilds.cache.get(guildId)?.fetchWelcomeScreen();
      if (!fetched) return undefined;

      cache.welcomeScreens.set(fetched);
      return fetched;
    },
    set: (screen: Discord.WelcomeScreen) => {
      cache.welcomeScreens.cache.set(screen.guild.id, screen);
    },
    delete: (guildId) => {
      cache.welcomeScreens.cache.delete(guildId);
    },
    cache: new Map(),
  },

  giveawayClaimTimeout: {
    set: (job, guildId, userId) => {
      const cached = cache.giveawayClaimTimeout.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (!cache.giveawayClaimTimeout.cache.get(guildId)) {
        cache.giveawayClaimTimeout.cache.set(guildId, new Map());
      }
      cache.giveawayClaimTimeout.cache.get(guildId)?.set(userId, job);
    },
    delete: (guildId, userId) => {
      const cached = cache.giveawayClaimTimeout.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (cache.giveawayClaimTimeout.cache.get(guildId)?.size === 1) {
        cache.giveawayClaimTimeout.cache.delete(guildId);
      } else {
        cache.giveawayClaimTimeout.cache.get(guildId)?.delete(userId);
      }
    },
    cache: new Map(),
  },
  mutes: {
    set: (job, guildId, userId) => {
      const cached = cache.mutes.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (!cache.mutes.cache.get(guildId)) {
        cache.mutes.cache.set(guildId, new Map());
      }
      cache.mutes.cache.get(guildId)?.set(userId, job);
    },
    delete: (guildId, userId) => {
      const cached = cache.mutes.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (cache.mutes.cache.get(guildId)?.size === 1) {
        cache.mutes.cache.delete(guildId);
      } else {
        cache.mutes.cache.get(guildId)?.delete(userId);
      }
    },
    cache: new Map(),
  },
  bans: {
    set: (job, guildId, userId) => {
      const cached = cache.bans.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (!cache.bans.cache.get(guildId)) {
        cache.bans.cache.set(guildId, new Map());
      }
      cache.bans.cache.get(guildId)?.set(userId, job);
    },
    delete: (guildId, userId) => {
      const cached = cache.bans.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (cache.bans.cache.get(guildId)?.size === 1) {
        cache.bans.cache.delete(guildId);
      } else {
        cache.bans.cache.get(guildId)?.delete(userId);
      }
    },
    cache: new Map(),
  },
  channelBans: {
    set: (job, guildId, channelId, userId) => {
      const cached = cache.channelBans.cache.get(guildId)?.get(channelId)?.get(userId);
      cached?.cancel();

      if (!cache.channelBans.cache.get(guildId)) {
        cache.channelBans.cache.set(guildId, new Map());
      }

      if (!cache.channelBans.cache.get(guildId)?.get(channelId)) {
        cache.channelBans.cache.get(guildId)?.set(channelId, new Map());
      }

      cache.channelBans.cache.get(guildId)?.get(channelId)?.set(userId, job);
    },
    delete: (guildId, channelId, userId) => {
      const cached = cache.channelBans.cache.get(guildId)?.get(channelId)?.get(userId);
      cached?.cancel();

      if (cache.channelBans.cache.get(guildId)?.size === 1) {
        if (cache.channelBans.cache.get(guildId)?.get(channelId)?.size === 1) {
          cache.channelBans.cache.get(guildId)?.get(channelId)?.clear();
        } else cache.channelBans.cache.get(guildId)?.get(channelId)?.delete(userId);
      } else if (cache.channelBans.cache.get(guildId)?.get(channelId)?.size === 1) {
        cache.channelBans.cache.get(guildId)?.delete(channelId);
      } else {
        cache.channelBans.cache.get(guildId)?.get(channelId)?.delete(userId);
      }
    },
    cache: new Map(),
  },
  reminders: {
    set: (job, userId, timestamp) => {
      const cached = cache.reminders.cache.get(userId)?.get(timestamp);
      cached?.cancel();

      if (!cache.reminders.cache.get(userId)) {
        cache.reminders.cache.set(userId, new Map());
      }
      cache.reminders.cache.get(userId)?.set(timestamp, job);
    },
    delete: (userId, timestamp) => {
      const cached = cache.reminders.cache.get(userId)?.get(timestamp);
      cached?.cancel();

      if (cache.reminders.cache.get(userId)?.size === 1) {
        cache.reminders.cache.delete(userId);
      } else {
        cache.reminders.cache.get(userId)?.delete(timestamp);
      }
    },
    cache: new Map(),
  },
  disboardBumpReminders: {
    set: (job, guildId) => {
      const cached = cache.disboardBumpReminders.cache.get(guildId);
      cached?.cancel();

      cache.disboardBumpReminders.cache.set(guildId, job);
    },
    delete: (guildId) => {
      const cached = cache.disboardBumpReminders.cache.get(guildId);
      cached?.cancel();
      cache.disboardBumpReminders.cache.delete(guildId);
    },
    cache: new Map(),
  },
  verificationCodes: {
    set: (code, guildId, userId) => {
      if (!cache.verificationCodes.cache.get(guildId)) {
        cache.verificationCodes.cache.set(guildId, new Map());
      }

      cache.verificationCodes.cache?.get(guildId)?.set(userId, code);
    },
    delete: (guildId, userId) => {
      if (cache.verificationCodes.cache.get(guildId)?.size === 1) {
        cache.verificationCodes.cache.delete(guildId);
      } else {
        cache.verificationCodes.cache.get(guildId)?.delete(userId);
      }
    },
    cache: new Map(),
  },
  giveaways: {
    set: (job, guildId, channelId, msgId) => {
      const cached = cache.giveaways.cache.get(guildId)?.get(channelId)?.get(msgId);
      cached?.cancel();

      if (!cache.giveaways.cache.get(guildId)) {
        cache.giveaways.cache.set(guildId, new Map());
      }

      if (!cache.giveaways.cache.get(guildId)?.get(channelId)) {
        cache.giveaways.cache.get(guildId)?.set(channelId, new Map());
      }

      cache.giveaways.cache.get(guildId)?.get(channelId)?.set(msgId, job);
    },
    delete: (guildId, channelId, msgId) => {
      const cached = cache.giveaways.cache.get(guildId)?.get(channelId)?.get(msgId);
      cached?.cancel();

      if (cache.giveaways.cache.get(guildId)?.size === 1) {
        if (cache.giveaways.cache.get(guildId)?.get(channelId)?.size === 1) {
          cache.giveaways.cache.get(guildId)?.get(channelId)?.clear();
        } else cache.giveaways.cache.get(guildId)?.get(channelId)?.delete(msgId);
      } else if (cache.giveaways.cache.get(guildId)?.get(channelId)?.size === 1) {
        cache.giveaways.cache.get(guildId)?.delete(channelId);
      } else {
        cache.giveaways.cache.get(guildId)?.get(channelId)?.delete(msgId);
      }
    },
    cache: new Map(),
  },
};

export default cache;
