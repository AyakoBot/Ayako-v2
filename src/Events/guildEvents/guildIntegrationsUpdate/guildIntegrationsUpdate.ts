import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (guild: Discord.Guild) => {
  const cached = client.cache.integrations.cache.get(guild.id);
  const fetched = await guild.fetchIntegrations();
  fetched.forEach((f) => client.cache.integrations.set(f, guild.id));
  if (!cached) return;

  const added = fetched.filter((f) => !cached.get(f.id)).map((o) => o);
  const removed = Array.from(cached, ([, f]) => f).filter((f) => !fetched?.get(f.id));
  const changed = client.ch.getChanged(
    Array.from(cached, ([, f]) => f) as unknown as { [key: string]: unknown }[],
    fetched.map((o) => o) as unknown as { [key: string]: unknown }[],
    'id',
  ) as unknown as Discord.Integration[];

  if (added.length) {
    added.forEach(async (add) =>
      (await import('./guildIntegrationsCreate/guildIntegrationsCreate.js')).default(add),
    );
  }
  if (removed.length) {
    removed.forEach(async (remove) =>
      (await import('./guildIntegrationsDelete/guildIntegrationsDelete.js')).default(remove),
    );
  }
  if (changed.length) {
    changed.forEach(async (change) =>
      (await import('./guildIntegrationsUpdate/guildIntegrationsUpdate.js')).default(
        cached.get(change.id) as Discord.Integration,
        fetched.get(change.id) as Discord.Integration,
      ),
    );
  }
};
