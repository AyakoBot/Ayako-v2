import * as Discord from 'discord.js';
import * as ch from '../../ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.expire,
 punishmentOf: (target: Discord.User) =>
  t.stp(t.JSON.expire.punishmentOf, { target: ch.constants.standard.user(target) }),
 endedAt: (time: string) => t.stp(t.JSON.expire.endedAt, { time }),
});
