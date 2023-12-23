import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.role,
 author: t.stp(t.JSON.slashCommands.info.role.author, { t }),
});
