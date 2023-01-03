import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: { guildId: bigint }) => {
  const guild = await client.cache.guilds.get(payload.guildId);
  if (!guild) return;

  const newIntegrations = await client.helpers.getIntegrations(payload.guildId);
  if (!newIntegrations) return;

  const oldIntegrations = client.integrations.get(payload.guildId);
  cacheIntegrations(payload.guildId, newIntegrations);

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

const cacheIntegrations = (
  guildId: bigint,
  integrations: DDeno.Collection<bigint, DDeno.Integration>,
) => {
  if (!client.integrations.get(guildId)) client.integrations.set(guildId, new Map());

  integrations.forEach((i) => {
    client.integrations.get(guildId)?.set(i.id, i);
  });
};
