import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import log from './log.js';

export default async (invite: Discord.Invite) => {
  if (!invite.guild?.id) return;

  const guild = client.guilds.cache.get(invite.guild.id);
  if (!guild) return;

  ch.cache.invites.set(invite, invite.guild.id);

  log(invite, guild);
};
