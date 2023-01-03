import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: { channelId: bigint; guildId?: bigint; code: string }) => {
  if (!payload.guildId) return;

  const guild = await client.cache.guilds.get(payload.guildId);
  if (!guild) return;

  const invite = client.invites.get(guild.id)?.get(payload.code);
  if (!invite) return;

  const files: {
    default: (i: DDeno.InviteMetadata, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(invite, guild));
};
