import * as CT from '../../../../Typings/CustomTypings.js';
import inherit from './embedbuilder/inherit.js';
import create from './embedbuilder/create.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.embedbuilder,
 inherit: inherit(t),
 create: create(t),
});
