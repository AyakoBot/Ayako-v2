import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (invite: Discord.Invite) => {
 if (!invite.guild) return;
 if (!invite.channel) return;

 const guild = client.guilds.cache.get(invite.guild.id);
 if (!guild) return;

 ch.cache.invites.delete(invite.code, invite.guild.id, invite.channel.id);

 log(invite, guild);
};
