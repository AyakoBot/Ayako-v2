import * as Discord from 'discord.js';
import getUser from './getUser.js';
import * as Classes from '../Other/classes.js';
import { request } from './requestHandler.js';
import { guild as getBotIdFromGuild } from './getBotIdFrom.js';

export default async (guild: Discord.Guild) => {
 const currentMember = await request.guilds.getMember(guild, await getBotIdFromGuild(guild));
 if ('message' in currentMember) return undefined;

 const me = currentMember ? new Classes.GuildMember(guild.client, currentMember, guild) : undefined;
 if (!new Discord.PermissionsBitField(me?.permissions).has(32n)) return null;

 // TODO: change to request handler
 const invites = await guild.invites.fetch().then((i) => i.map((o) => o));
 if (!invites) return null;
 if (!guild.vanityURLCode) return invites;

 const vanityUrl = await request.guilds.getVanityURL(guild);
 if (!vanityUrl) return invites;
 if (!vanityUrl.code) return invites;

 const owner = await getUser(guild.ownerId);

 invites.push({
  client: guild.client,
  channel: null,
  channelId: null,
  code: guild.vanityURLCode,
  deletable: false,
  createdAt: null,
  createdTimestamp: new Date().getTime(),
  expiresAt: null,
  expiresTimestamp: null,
  guild,
  inviter: (owner as Discord.User) ?? null,
  inviterId: guild.ownerId,
  maxAge: null,
  maxUses: null,
  memberCount: guild.memberCount,
  presenceCount: guild.approximatePresenceCount ?? 0,
  targetApplication: null,
  targetUser: null,
  targetType: null,
  temporary: false,
  url: `https://discord.gg/${guild.vanityURLCode}`,
  uses: 'message' in vanityUrl ? 0 : vanityUrl.uses,
  delete: (reason?: string) => {
   throw new Error(`Function not implemented. Reason: ${reason}`);
  },
  toJSON: () => {
   throw new Error('Function not implemented');
  },
  toString: () => {
   throw new Error('Function not implemented');
  },
  valueOf: () => {
   throw new Error('Function not implemented');
  },
  stageInstance: null,
  guildScheduledEvent: null,
 });

 return invites;
};
