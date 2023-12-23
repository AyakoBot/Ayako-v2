import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.emojis,
 author: t.stp(t.JSON.slashCommands.info.emojis.author, { t }),
});
