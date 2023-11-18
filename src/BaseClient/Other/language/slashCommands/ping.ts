import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.ping,
 author: t.stp(t.JSON.slashCommands.ping.author, { t }),
});
