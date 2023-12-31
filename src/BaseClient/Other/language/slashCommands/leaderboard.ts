import * as CT from '../../../../Typings/Typings.js';
import * as ch from '../../../ClientHelper.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.leaderboard,
 thisWillTake: (msgs: number, duration: string) =>
  t.stp(t.JSON.slashCommands.leaderboard.thisWillTake, {
   msgs: ch.util.makeBold(ch.splitByThousand(msgs)),
   duration: ch.util.makeInlineCode(duration),
  }),
 lleaderboard: t.stp(t.JSON.slashCommands.leaderboard.lleaderboard, { t }),
 nleaderboard: t.stp(t.JSON.slashCommands.leaderboard.nleaderboard, { t }),
});
