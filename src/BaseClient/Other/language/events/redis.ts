import type { Role, User } from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.redis,
 votePunish: {
  ...t.JSON.events.redis.votePunish,
  voteContent: (time: string, roles: Role[]) =>
   t.stp(t.JSON.events.redis.votePunish.voteContent, {
    time,
    roles: roles.map((r) => r.toString()).join(', '),
   }),
  content: (role: Role | undefined, user: User, time: string) =>
   t.stp(t.JSON.events.redis.votePunish.content, {
    roleName: role?.name || t.JSON.t.Unknown,
    user: user?.toString(),
    time,
   }),
 },
});
