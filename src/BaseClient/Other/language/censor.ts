import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.censor,
 warnNewlines: (n: number) => t.stp(t.JSON.censor.warnNewlines, { n }),
});
