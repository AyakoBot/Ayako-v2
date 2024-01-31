import clear from './SlashCommands/clear.js';
import embedBuilder from './SlashCommands/embed-builder.js';
import emojis from './SlashCommands/emojis.js';
import giveaway from './SlashCommands/giveaway.js';
import help from './SlashCommands/help.js';
import images from './SlashCommands/images.js';
import info from './SlashCommands/info.js';
import invites from './SlashCommands/invites.js';
import leaderboard from './SlashCommands/leaderboard.js';
import mod from './SlashCommands/mod.js';
import other from './SlashCommands/other.js';
import reminder from './SlashCommands/reminder.js';
import roles from './SlashCommands/roles.js';
import rp from './SlashCommands/rp.js';
import server from './SlashCommands/server.js';
import settings from './SlashCommands/settings.js';
import stickers from './SlashCommands/stickers.js';
import user from './SlashCommands/user.js';

const self = {
 clear,
 'embed-builder': embedBuilder,
 emojis,
 giveaway,
 help,
 images,
 info,
 invites,
 leaderboard,
 mod,
 reminder,
 roles,
 rp,
 server,
 settings,
 stickers,
 user,
 ...other,
};

export default self;
