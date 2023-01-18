import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (payload: { channelId: bigint; guildId?: bigint; code: string }) => {
  if (!payload.guildId) return;

  const guild = await client.ch.cache.guilds.get(payload.guildId);
  if (!guild) return;

  const invite = client.ch.cache.invites.cache
    .get(guild.id)
    ?.get(payload.channelId)
    ?.get(payload.code);
  if (!invite) return;

  const files: {
    default: (i: DDeno.InviteMetadata, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(invite, guild));
};
