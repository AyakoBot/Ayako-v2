import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.leaderboard,
 thisWillTake: (msgs: number, duration: string) =>
  t.stp(t.JSON.slashCommands.leaderboard.thisWillTake, {
   msgs: t.util.util.makeBold(t.util.splitByThousand(msgs)),
   duration: t.util.util.makeInlineCode(duration),
  }),
 lleaderboard: t.stp(t.JSON.slashCommands.leaderboard.lleaderboard, { t }),
 nleaderboard: t.stp(t.JSON.slashCommands.leaderboard.nleaderboard, { t }),
});
