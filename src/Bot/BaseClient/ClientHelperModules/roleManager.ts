import * as Jobs from 'node-schedule';
import type * as DDeno from 'discordeno';
import Discord from 'discord.js';
import isManageable from './isManageable.js';
import client from '../DDenoClient.js';

const MemberCache: {
  member: DDeno.Member;
  addRoles?: bigint[];
  removeRoles?: bigint[];
  prio: number;
  reason: string;
  added: number;
}[] = [];

const GuildCache: Map<bigint, { job: Jobs.Job; members: typeof MemberCache; guild: DDeno.Guild }> =
  new Map();

const roleManager = {
  add: async (member: DDeno.Member, roles: bigint[], reason: string, prio = 2) => {
    handleRoleUpdate(member, roles, reason, prio, 'addRoles');
  },
  remove: async (member: DDeno.Member, roles: bigint[], reason: string, prio = 2) => {
    handleRoleUpdate(member, roles, reason, prio, 'removeRoles');
  },
};

const handleRoleUpdate = async (
  member: DDeno.Member,
  roles: bigint[],
  reason: string,
  prio: number,
  type: 'addRoles' | 'removeRoles',
) => {
  const guild = await client.helpers.getGuild(member.guildId);
  const me = await client.helpers.getMember(member.guildId, client.id);

  if (!isManageable(member, me)) return;
  if (!new Discord.PermissionsBitField(me.permissions).has(268435456n)) return;

  const roleGuild = GuildCache.get(member.guildId);
  if (!roleGuild) {
    GuildCache.set(member.guildId, {
      job: Jobs.scheduleJob('*/1 * * * * *', () => runJob(member.guildId)),
      members: [{ member, [type]: roles, reason, prio, added: Date.now() }],
      guild,
    });
    return;
  }

  const existingEntry = MemberCache[MemberCache.findIndex((c) => c.member.id === member.id)];
  if (existingEntry) {
    existingEntry[type] = existingEntry[type]?.length
      ? [...new Set([...(existingEntry[type] as bigint[]), ...roles])]
      : roles;

    return;
  }

  MemberCache.push({ member, [type]: roles, prio, reason, added: Date.now() });
};

export default roleManager;

const runJob = async (guildID: bigint) => {
  const memberCache = GuildCache.get(guildID);
  if (!memberCache) return;

  const prioSort = memberCache?.members.sort((a, b) => a.prio - b.prio);
  const highestPrio = prioSort[0]?.prio;
  if (!highestPrio) return;

  const prioFilter = memberCache?.members.filter((m) => m.prio === highestPrio);
  const dateFilter = prioFilter.sort((a, b) => b.added - a.added);
  const memberData = dateFilter[0];
  const roles = memberData.addRoles?.length
    ? [...memberData.member.roles, ...memberData.addRoles]
    : memberData.member.roles;
  const me = await client.helpers.getMember(memberCache.guild.id, client.id);
  const clientHighestRole = me?.roles
    .sort(
      (a, b) =>
        Number(memberCache.guild.roles.get(b)?.position) -
        Number(memberCache.guild.roles.get(a)?.position),
    )
    .shift();
  if (!clientHighestRole) return;

  const editedRoles = roles.filter((r) => {
    const role = memberCache.guild.roles.get(r);

    if (!role) return false;
    if (memberData.removeRoles?.includes(r)) return false;

    if (Number(memberCache.guild.roles.get(clientHighestRole)?.position) < role.position) {
      return false;
    }

    return true;
  });

  const roleAdd = await client.helpers
    .editMember(memberData.member.guildId, memberData.member.id, {
      roles: editedRoles,
    })
    .catch(() => null);
  if (!roleAdd) return;

  const index = memberCache.members.findIndex((m) => m.member.id === memberData.member.id);
  memberCache.members.splice(index, 1);

  if (!memberCache.members.length) {
    memberCache.job.cancel();
    GuildCache.delete(guildID);
  }
};
