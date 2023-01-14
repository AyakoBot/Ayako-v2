import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (invite: DDeno.Invite) => {
  if (!invite.guildId) return;

  const guild = await client.ch.cache.guilds.get(invite.guildId);
  if (!guild) return;

  const inviteMetadata = await client.helpers.getInvite(invite.code);
  client.ch.cache.invites.set(invite);

  const files: {
    default: (i: DDeno.BaseInvite, g: DDeno.Guild, r: DDeno.Invite) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(inviteMetadata, guild, invite));
};
