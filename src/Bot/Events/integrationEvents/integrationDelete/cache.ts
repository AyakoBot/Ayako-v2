import client from '../../../BaseClient/DDenoClient.js';

export default (payload: { id: bigint; guildId: bigint; applicationId: bigint }) => {
  if (client.integrations.get(payload.guildId)?.size === 1) {
    client.integrations.delete(payload.guildId);
  } else {
    client.integrations.get(payload.guildId)?.delete(payload.id);
  }
};
