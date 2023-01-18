import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (payload: { guildId: bigint }) => {
  const guild = await client.ch.cache.guilds.get(payload.guild.id);
  if (!guild) return;

  const newIntegrations = await client.helpers.getIntegrations(payload.guild.id);
  if (!newIntegrations) return;

  const oldIntegrations = client.ch.cache.integrations.cache.get(payload.guild.id);
  if (!oldIntegrations) return;

  const changedInteraction = client.ch.getChanged(
    newIntegrations.map((o) => o),
    Array.from(oldIntegrations, ([, i]) => i),
    'id',
  ) as DDeno.Integration[] | undefined;
  if (!changedInteraction) return;

  changedInteraction.forEach(async (integration) => {
    const oldIntegration = oldIntegrations.get(integration.id);
    const newIntegration = newIntegrations.get(integration.id);

    if (!oldIntegration) return;
    if (!newIntegration) return;

    const files: {
      default: (oI: DDeno.Integration, nI: DDeno.Integration) => void;
    }[] = await Promise.all(['./log.js'].map((p) => import(p)));

    files.forEach((f) => f.default(oldIntegration, newIntegration));
  });
};
