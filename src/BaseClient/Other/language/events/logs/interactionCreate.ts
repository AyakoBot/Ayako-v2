import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.interactionCreate,
 cooldown: (time: string) => t.stp(t.JSON.events.interactionCreate.cooldown, { time }),
});
