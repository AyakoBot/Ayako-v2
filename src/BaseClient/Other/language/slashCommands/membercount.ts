import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.membercount,
 author: t.stp(t.JSON.slashCommands.membercount.author, { t }),
});
