import check from './AutocompleteCommands/check.js';
import embedBuilder from './AutocompleteCommands/embed-builder.js';
import giveaway from './AutocompleteCommands/giveaway.js';
import help from './AutocompleteCommands/help.js';
import info from './AutocompleteCommands/info.js';
import mod from './AutocompleteCommands/mod.js';
import reminder from './AutocompleteCommands/reminder.js';
import selfRoles from './AutocompleteCommands/self-roles.js';
import server from './AutocompleteCommands/server.js';
import settings from './AutocompleteCommands/settings.js';
import stickers from './AutocompleteCommands/stickers.js';
import user from './AutocompleteCommands/user.js';

const self = {
 'embed-builder': embedBuilder,
 giveaway,
 help,
 info,
 mod,
 reminder,
 server,
 settings,
 stickers,
 user,
 check,
 'self-roles': selfRoles,
};

export default self;
