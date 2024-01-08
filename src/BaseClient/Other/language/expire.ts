import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.expire,
 punishmentOf: (target: Discord.User) =>
  t.stp(t.JSON.expire.punishmentOf, { target: t.util.constants.standard.user(target) }),
 endedAt: (time: string) => t.stp(t.JSON.expire.endedAt, { time }),
});
