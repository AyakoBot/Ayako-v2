import type * as Discord from 'discord.js';
import { ch, client } from '../../../BaseClient/Client.js';

export default async (invite: Discord.Invite) => {
  if (!invite.guild) return;
  if (!invite.channel) return;

  const guild = client.guilds.cache.get(invite.guild.id);
  if (!guild) return;

  ch.cache.invites.delete(invite.code, invite.guild.id, invite.channel.id);

  const files: {
    default: (i: Discord.Invite, g: Discord.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(invite, guild));
};
