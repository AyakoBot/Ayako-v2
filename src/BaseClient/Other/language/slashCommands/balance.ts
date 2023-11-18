import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.balance,
 how2Earn: (emote: string) => t.stp(t.JSON.slashCommands.balance.how2Earn, { emote }),
});
