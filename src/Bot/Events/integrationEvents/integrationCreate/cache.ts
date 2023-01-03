import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default (integration: DDeno.Integration) => {
  if (!client.integrations.get(integration.guildId)) {
    client.integrations.set(integration.guildId, new Map());
  }
  client.integrations.get(integration.guildId)?.set(integration.id, integration);
};
