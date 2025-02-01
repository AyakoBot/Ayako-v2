import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.leaderboard,
 thisWillTake: (msgs: number, msgDuration: string, voiceMins: number, voiceDuration: string) =>
  t.stp(t.JSON.slashCommands.leaderboard.thisWillTake, {
   msgs: t.util.util.makeBold(t.util.splitByThousand(msgs)),
   msgDuration: t.util.util.makeInlineCode(msgDuration),
   voiceMins: t.util.util.makeBold(t.util.splitByThousand(voiceMins)),
   voiceDuration: t.util.util.makeInlineCode(voiceDuration),
  }),
 lleaderboard: t.stp(t.JSON.slashCommands.leaderboard.lleaderboard, { t }),
 nleaderboard: t.stp(t.JSON.slashCommands.leaderboard.nleaderboard, { t }),
});
