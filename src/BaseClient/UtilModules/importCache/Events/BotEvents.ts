import applicationCommandPermissionsEvents from './BotEvents/applicationCommandPermissionsEvents.js';
import autoModerationActionEvents from './BotEvents/autoModerationActionEvents.js';
import autoModerationRuleEvents from './BotEvents/autoModerationRuleEvents.js';
import channelEvents from './BotEvents/channelEvents.js';
import emojiEvents from './BotEvents/emojiEvents.js';
import guildEvents from './BotEvents/guildEvents.js';
import interactionEvents from './BotEvents/interactionEvents.js';
import inviteEvents from './BotEvents/inviteEvents.js';
import messageEvents from './BotEvents/messageEvents.js';
import other from './BotEvents/other.js';
import readyEvents from './BotEvents/readyEvents.js';
import roleEvents from './BotEvents/roleEvents.js';
import stageInstanceEvents from './BotEvents/stageInstanceEvents.js';
import stickerEvents from './BotEvents/stickerEvents.js';
import threadEvents from './BotEvents/threadEvents.js';
import typingEvents from './BotEvents/typingEvents.js';
import userEvents from './BotEvents/userEvents.js';
import voiceStateEvents from './BotEvents/voiceStateEvents.js';
import webhooksEvents from './BotEvents/webhooksEvents.js';

export default {
 applicationCommandPermissionsEvents,
 autoModerationActionEvents,
 autoModerationRuleEvents,
 channelEvents,
 emojiEvents,
 guildEvents,
 interactionEvents,
 inviteEvents,
 messageEvents,
 ...other,
 readyEvents,
 roleEvents,
 stageInstanceEvents,
 stickerEvents,
 threadEvents,
 typingEvents,
 userEvents,
 voiceStateEvents,
 webhooksEvents,
};
