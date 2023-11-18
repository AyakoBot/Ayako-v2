import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.embedbuilder.inherit,
 placeholder2: t.stp(t.JSON.slashCommands.embedbuilder.inherit.placeholder2, {
  t,
 }),
});
