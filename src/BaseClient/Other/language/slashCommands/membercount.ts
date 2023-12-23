import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.membercount,
 author: t.stp(t.JSON.slashCommands.membercount.author, { t }),
});
