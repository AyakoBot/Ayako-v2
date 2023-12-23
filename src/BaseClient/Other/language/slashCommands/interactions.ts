import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.interactions,
 holdhands: t.JSON.holdhands,
 handhold: t.JSON.holdhands,
});
