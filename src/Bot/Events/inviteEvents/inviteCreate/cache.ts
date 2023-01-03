import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (_: DDeno.Invite, guild: DDeno.Guild, invite: DDeno.Invite) => {
  if (!client.invites.get(guild.id)) client.invites.set(guild.id, new Map());
  client.invites.get(guild.id)?.set(invite.code, invite);
};
