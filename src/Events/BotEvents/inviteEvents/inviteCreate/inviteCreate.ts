import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async (invite: Discord.Invite) => {
 if (!invite.guild?.id) return;

 const guild = client.guilds.cache.get(invite.guild.id);
 if (!guild) return;

 invite.client.util.cache.invites.set(invite, invite.guild.id);

 invite.client.util.importCache.Events.BotEvents.inviteEvents.inviteCreate.log.file.default(
  invite,
  guild,
 );
};
