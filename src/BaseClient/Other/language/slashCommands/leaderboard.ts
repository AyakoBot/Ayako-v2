import * as ch from '../../../ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.leaderboard,
 thisWillTake: (msgs: number, duration: string) =>
  t.stp(t.JSON.slashCommands.edit.desc, {
   msgs: ch.util.makeBold(ch.splitByThousand(msgs)),
   duration: ch.util.makeInlineCode(duration),
  }),
});
