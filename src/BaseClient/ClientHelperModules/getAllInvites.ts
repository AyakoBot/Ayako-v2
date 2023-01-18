import type * as Discord from 'discord.js';
import Discord from 'discord.js';
import client from '../Client.js';

export default async (guild: DDeno.Guild) => {
  const me = await client.helpers.getMember(guild.id, client.id);
  if (!new Discord.PermissionsBitField(me?.permissions).has(32n)) return null;

  const invites = await client.helpers.getInvites(guild.id).catch(() => null);
  if (!invites) return null;

  if (!guild.vanityUrlCode) return invites;

  const vanityUrl = await client.helpers.getVanityUrl(guild.id);
  if (!vanityUrl) return invites;

  invites.set(guild.vanityUrlCode, {
    code: guild.vanityUrlCode,
    guildId: guild.id,
    uses: vanityUrl.uses,
    temporary: false,
    maxUses: Infinity,
    maxAge: Infinity,
    createdAt: Date.now(),
  });

  return invites;
};
