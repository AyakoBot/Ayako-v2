import * as CT from '../../../../Typings/CustomTypings.js';
import invite from './info/invite.js';
import emojis from './info/emojis.js';
import role from './info/role.js';
import badges from './info/badges.js';
import bot from './info/bot.js';
import user from './info/user.js';
import server from './info/server.js';
import channel from './info/channel.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info,
 invite: invite(t),
 emojis: emojis(t),
 role: role(t),
 badges: badges(t),
 bot: bot(t),
 user: user(t),
 server: server(t),
 channel: channel(t),
});
