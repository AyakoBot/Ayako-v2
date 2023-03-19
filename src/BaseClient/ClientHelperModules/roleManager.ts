import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';

const MemberCaches: {
  member: Discord.GuildMember;
  addRoles?: string[];
  removeRoles?: string[];
  prio: number;
  reason: string;
  added: number;
}[] = [];

const GuildCache: Map<
  string,
  { job: Jobs.Job; members: typeof MemberCaches; guild: Discord.Guild }
> = new Map();

const roleManager = {
  add: async (member: Discord.GuildMember, roles: string[], reason: string, prio = 2) => {
    handleRoleUpdate(member, roles, reason, prio, 'addRoles');
  },
  remove: async (member: Discord.GuildMember, roles: string[], reason: string, prio = 2) => {
    handleRoleUpdate(member, roles, reason, prio, 'removeRoles');
  },
};

const handleRoleUpdate = async (
  member: Discord.GuildMember,
  roles: string[],
  reason: string,
  prio: number,
  type: 'addRoles' | 'removeRoles',
) => {
  const { me } = member.guild.members;
  if (!me) return;

  const roleGuild = GuildCache.get(member.guild.id);
  if (!roleGuild) {
    GuildCache.set(member.guild.id, {
      job: Jobs.scheduleJob('*/1 * * * * *', () => runJob(member.guild)),
      members: [{ member, [type]: roles, reason, prio, added: Date.now() }],
      guild: member.guild,
    });

    return;
  }

  const existingEntry = MemberCaches[MemberCaches.findIndex((c) => c.member.id === member.id)];
  if (existingEntry) {
    existingEntry[type] = existingEntry[type]?.length
      ? [...new Set([...(existingEntry[type] as string[]), ...roles])]
      : roles;

    return;
  }

  MemberCaches.push({ member, [type]: roles, prio, reason, added: Date.now() });
};

export default roleManager;

const runJob = async (guild: Discord.Guild) => {
  const endJob = (memberCaches: {
    job: Jobs.Job;
    members: typeof MemberCaches;
    guild: Discord.Guild;
  }) => {
    const index = memberCaches.members.findIndex((m) => m.member.id === memberCache.member.id);
    memberCaches.members.splice(index, 1);

    if (!memberCaches.members.length) {
      memberCaches.job.cancel();
      GuildCache.delete(guild.id);
    }
  };

  const memberCaches = GuildCache.get(guild.id);
  if (!memberCaches) return;

  const { me } = guild.members;
  if (!me?.permissions.has(268435456n)) return endJob(memberCaches);

  const prioSort = memberCaches?.members.sort((a, b) => a.prio - b.prio);
  const highestPrio = prioSort[0]?.prio;
  const prioFilter = memberCaches?.members.filter((m) => m.prio === highestPrio);
  const dateFilter = prioFilter.sort((a, b) => b.added - a.added);
  const memberCache = dateFilter[0];
  const roles = memberCache.addRoles?.length
    ? [...memberCache.member.roles.cache.map((r) => r), ...memberCache.addRoles]
    : memberCache.member.roles.cache.map((r) => r);

  const clientHighestRole = me?.roles.highest;
  if (!clientHighestRole) return endJob(memberCaches);

  const editedRoles = roles.filter((r) => {
    const role = typeof r === 'string' ? memberCaches.guild.roles.cache.get(r) : r;

    if (!role) return false;
    if (role.id === guild.id) return false;
    if (memberCache.removeRoles?.includes(typeof r === 'string' ? r : r.id)) return false;
    if (clientHighestRole.position < role.position) return false;

    return true;
  });

  if (!editedRoles.length) return endJob(memberCaches);

  memberCache.member
    .edit({
      roles: editedRoles,
    })
    .catch(console.error);

  endJob(memberCaches);
};
