import * as CT from '../../../../Typings/CustomTypings.js';
import create from './giveaway/create.js';
import end from './giveaway/end.js';
import participate from './giveaway/participate.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.giveaway,
 create: create(t),
 end: end(t),
 participate: participate(t),
});
