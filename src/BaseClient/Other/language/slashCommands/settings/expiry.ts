import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.expiry,
 desc: (cmdId: string) => t.stp(t.JSON.slashCommands.settings.categories.expiry.desc, { t, cmdId }),
});
