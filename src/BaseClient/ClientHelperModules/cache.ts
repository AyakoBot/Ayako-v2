import auditLogs, { AuditLogs } from './cache/discord/auditLogs.js';
import commandPermissions, { CommandPermissions } from './cache/discord/commandPermissions.js';
import integrations, { Integrations } from './cache/discord/integrations.js';
import inviteGuilds, { InviteGuilds } from './cache/discord/inviteGuilds.js';
import pins, { Pins } from './cache/discord/pins.js';
import scheduledEventUsers, { ScheduledEventUsers } from './cache/discord/scheduledEventUsers.js';
import webhooks, { Webhooks } from './cache/discord/webhooks.js';
import welcomeScreens, { WelcomeScreens } from './cache/discord/welcomeScreens.js';
import onboarding, { Onboarding } from './cache/discord/onboarding.js';
import invites, { Invites } from './cache/discord/invites.js';

import giveawayClaimTimeout, { GiveawayClaimTimeout } from './cache/bot/giveawayClaimTimeout.js';
import mutes, { Mutes } from './cache/bot/mutes.js';
import bans, { Bans } from './cache/bot/bans.js';
import channelBans, { ChannelBans } from './cache/bot/channelBans.js';
import reminders, { Reminders } from './cache/bot/reminders.js';
import disboardBumpReminders, { DisboardBumpReminders } from './cache/bot/disboardBumpReminders.js';
import giveaways, { Giveaways } from './cache/bot/giveaways.js';
import stickyTimeouts, { StickyTimeouts } from './cache/bot/stickyTimeouts.js';

const cache: {
 // Discord Cache
 invites: Invites;
 webhooks: Webhooks;
 integrations: Integrations;
 scheduledEventUsers: ScheduledEventUsers;
 welcomeScreens: WelcomeScreens;
 pins: Pins;
 inviteGuilds: InviteGuilds;
 onboarding: Onboarding;
 commandPermissions: CommandPermissions;
 auditLogs: AuditLogs;

 // Cache
 giveawayClaimTimeout: GiveawayClaimTimeout;
 mutes: Mutes;
 bans: Bans;
 channelBans: ChannelBans;
 reminders: Reminders;
 disboardBumpReminders: DisboardBumpReminders;
 giveaways: Giveaways;
 stickyTimeouts: StickyTimeouts;
} = {
 // Discord Cache
 invites,
 webhooks,
 integrations,
 scheduledEventUsers,
 welcomeScreens,
 pins,
 inviteGuilds,
 onboarding,
 commandPermissions,

 // Cache
 giveawayClaimTimeout,
 mutes,
 bans,
 channelBans,
 reminders,
 disboardBumpReminders,
 giveaways,
 stickyTimeouts,
 auditLogs,
};

export default cache;
