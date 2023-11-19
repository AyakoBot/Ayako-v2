import * as CT from '../../../Typings/CustomTypings.js';
import afk from './slashCommands/afk.js';
import balance from './slashCommands/balance.js';
import check from './slashCommands/check.js';
import clear from './slashCommands/clear.js';
import edit from './slashCommands/edit.js';
import embedbuilder from './slashCommands/embedbuilder.js';
import emojis from './slashCommands/emojis.js';
import stickers from './slashCommands/stickers.js';
import giveaway from './slashCommands/giveaway.js';
import info from './slashCommands/info.js';
import interactions from './slashCommands/interactions.js';
import invites from './slashCommands/invites.js';
import leaderboard from './slashCommands/leaderboard.js';
import membercount from './slashCommands/membercount.js';
import moderation from './slashCommands/moderation.js';
import pardon from './slashCommands/pardon.js';
import ping from './slashCommands/ping.js';
import reminder from './slashCommands/reminder.js';
import resetLevels from './slashCommands/resetLevels.js';
import roles from './slashCommands/roles.js';
import rp from './slashCommands/rp.js';
import setLevel from './slashCommands/setLevel.js';
import settings from './slashCommands/settings.js';
import slowmode from './slashCommands/slowmode.js';
import suggest from './slashCommands/suggest.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands,
 setLevel: setLevel(t),
 resetLevels: resetLevels(t),
 edit: edit(t),
 leaderboard: leaderboard(t),
 check: check(t),
 balance: balance(t),
 suggest: suggest(t),
 reminder: reminder(t),
 clear: clear(t),
 moderation: moderation(t),
 slowmode: slowmode(t),
 pardon: pardon(t),
 afk: afk(t),
 roles: roles(t),
 interactions: interactions(t),
 rp: rp(t),
 embedbuilder: embedbuilder(t),
 membercount: membercount(t),
 ping: ping(t),
 emojis: emojis(t),
 stickers: stickers(t),
 invites: invites(t),
 info: info(t),
 settings: settings(t),
 giveaway: giveaway(t),
});
