import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import { request } from './requestHandler.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';
import getPathFromError from './getPathFromError.js';

type MemberCaches = {
 member: Discord.GuildMember;
 addRoles?: string[];
 removeRoles?: string[];
 prio: number;
 reason: string;
 added: number;
}[];

const GuildCache: Map<string, { job: Jobs.Job; members: MemberCaches; guild: Discord.Guild }> =
 new Map();

/**
 * A module for managing roles of a Discord guild member.
 */
const roleManager = {
 /**
  * Adds roles to a guild member.
  * @param member - The guild member to add roles to.
  * @param roles - An array of role IDs to add to the member.
  * @param reason - The reason for adding the roles.
  * @param prio - The priority of the role update. Defaults to 2.
  */
 add: async (member: Discord.GuildMember, roles: string[], reason: string, prio = 2) => {
  handleRoleUpdate(member, roles, reason, prio, 'addRoles');
 },

 /**
  * Removes roles from a guild member.
  * @param member - The guild member to remove roles from.
  * @param roles - An array of role IDs to remove from the member.
  * @param reason - The reason for removing the roles.
  * @param prio - The priority of the role update. Defaults to 2.
  */
 remove: async (member: Discord.GuildMember, roles: string[], reason: string, prio = 2) => {
  handleRoleUpdate(member, roles, reason, prio, 'removeRoles');
 },
};

/**
 * Handles updating roles for a guild member.
 * @param member - The guild member to update roles for.
 * @param roles - The roles to add or remove.
 * @param reason - The reason for updating the roles.
 * @param prio - The priority of the role update.
 * @param type - The type of role update, either 'addRoles' or 'removeRoles'.
 * @returns void
 */
const handleRoleUpdate = async (
 member: Discord.GuildMember,
 roles: string[],
 reason: string,
 prio: number,
 type: 'addRoles' | 'removeRoles',
) => {
 if (!roles.length) return;

 const roleGuild = GuildCache.get(member.guild.id);
 if (!roleGuild) {
  GuildCache.set(member.guild.id, {
   job: Jobs.scheduleJob(getPathFromError(new Error(member.id)), '*/1 * * * * *', () =>
    runJob(member.guild),
   ),
   members: [{ member, [type]: roles, reason, prio, added: Date.now() }],
   guild: member.guild,
  });

  return;
 }

 const existingEntry =
  roleGuild.members[roleGuild.members.findIndex((c) => c.member.id === member.id)];
 if (existingEntry) {
  existingEntry[type] = existingEntry[type]?.length
   ? [...new Set([...(existingEntry[type] as string[]), ...roles])]
   : roles;

  return;
 }

 roleGuild.members.push({ member, [type]: roles, prio, reason, added: Date.now() });
};

export default roleManager;

/**
 * Runs a job to manage roles for a guild.
 * @param guild - The guild to manage roles for.
 */
const runJob = async (guild: Discord.Guild) => {
 const endJob = (memberCaches: { job: Jobs.Job; members: MemberCaches; guild: Discord.Guild }) => {
  const index = memberCaches.members.findIndex((m) => m.member.id === memberCache.member.id);
  memberCaches.members.splice(index, 1);
  if (!memberCaches.members.length) {
   memberCaches.job.cancel();
   GuildCache.delete(guild.id);
  }
 };

 const memberCaches = GuildCache.get(guild.id);
 if (!memberCaches) return;

 const me = await getBotMemberFromGuild(guild);
 if (!me?.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
  endJob(memberCaches);
  return;
 }

 const prioSort = memberCaches?.members.sort((a, b) => a.prio - b.prio);
 const highestPrio = prioSort[0]?.prio;
 const prioFilter = memberCaches?.members.filter((m) => m.prio === highestPrio);
 const dateFilter = prioFilter.sort((a, b) => b.added - a.added);
 const memberCache = dateFilter[0];

 const clientHighestRole = me?.roles.highest;
 if (!clientHighestRole) {
  endJob(memberCaches);
  return;
 }

 const hasRoles = memberCache.member.roles.cache.map((r) => r.id);
 const mergedRoles = memberCache.addRoles?.length
  ? [...new Set([...hasRoles, ...memberCache.addRoles])]
  : [...hasRoles];

 const roles = mergedRoles.filter((r) => {
  const role = typeof r === 'string' ? guild.roles.cache.get(r) : r;
  if (!role) return false;

  if (role.id === guild.id) return false;
  if (memberCache.removeRoles?.includes(role.id)) return false;
  if (clientHighestRole.position < role.position && !memberCache.member.roles.cache.has(role.id)) {
   return false;
  }

  return true;
 });

 request.guilds.editMember(memberCache.member, { roles }, memberCache.reason);

 endJob(memberCaches);
};
