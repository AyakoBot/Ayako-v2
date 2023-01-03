import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default (invite: DDeno.Invite, guild: DDeno.Guild) => {
  if (client.invites.get(guild.id)?.size === 1) client.invites.delete(guild.id);
  else client.invites.get(guild.id)?.delete(invite.code);
};
