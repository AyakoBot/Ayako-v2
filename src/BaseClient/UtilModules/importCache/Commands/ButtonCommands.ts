import antiraid from './ButtonCommands/antiraid.js';
import other from './ButtonCommands/other.js';
import embedBuilder from './ButtonCommands/embed-builder.js';
import events from './ButtonCommands/events.js';
import giveaway from './ButtonCommands/giveaway.js';
import info from './ButtonCommands/info.js';
import mod from './ButtonCommands/mod.js';
import resetLevels from './ButtonCommands/reset-levels.js';
import roles from './ButtonCommands/roles.js';
import rp from './ButtonCommands/rp.js';
import server from './ButtonCommands/server.js';
import setLevel from './ButtonCommands/set-level.js';
import settings from './ButtonCommands/settings.js';
import shop from './ButtonCommands/shop.js';
import suggestion from './ButtonCommands/suggestion.js';
import verification from './ButtonCommands/verification.js';

const self = {
 antiraid,
 'embed-builder': embedBuilder,
 events,
 giveaway,
 info,
 mod,
 'reset-levels': resetLevels,
 roles,
 rp,
 server,
 'set-level': setLevel,
 settings,
 shop,
 suggestion,
 verification,
 ...other,
};

export default self;
