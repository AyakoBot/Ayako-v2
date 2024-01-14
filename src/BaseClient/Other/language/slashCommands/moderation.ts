import * as CT from '../../../../Typings/Typings.js';
import strike from './moderation/strike.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.moderation,
 strike: strike(t),
});
