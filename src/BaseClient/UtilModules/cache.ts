import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

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
import commands, { Commands } from './cache/discord/commands.js';

import giveawayClaimTimeout, { GiveawayClaimTimeout } from './cache/bot/giveawayClaimTimeout.js';
import mutes, { Mutes } from './cache/bot/mutes.js';
import bans, { Bans } from './cache/bot/bans.js';
import channelBans, { ChannelBans } from './cache/bot/channelBans.js';
import reminders, { Reminders } from './cache/bot/reminders.js';
import disboardBumpReminders, { DisboardBumpReminders } from './cache/bot/disboardBumpReminders.js';
import votes, { Votes } from './cache/bot/votes.js';
import giveaways, { Giveaways } from './cache/bot/giveaways.js';
import stickyTimeouts, { StickyTimeouts } from './cache/bot/stickyTimeouts.js';
import deleteThreads, { DeleteThreads } from './cache/bot/deleteThreads.js';
import deleteSuggestions, { DeleteSuggestions } from './cache/bot/deleteSuggestions.js';
import vcDeleteTimeout, { VcDeleteTimeout } from './cache/bot/vcDeleteTimeout.js';

import urlTLDs, { UrlTLDs } from './cache/urls/urlTLDs.js';
import sinkingYachts, { SinkingYachts } from './cache/urls/sinkingYachts.js';
import fishFish, { FishFish } from './cache/urls/fishFish.js';

/**
 * Discord and Cache data stored in the client.
 */
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
 votes: Votes;
 giveaways: Giveaways;
 stickyTimeouts: StickyTimeouts;
 deleteThreads: DeleteThreads;
 apis: Map<string, DiscordCore.API>;
 commands: Commands;
 punishments: Set<string>;
 antispam: Map<string, Discord.Message<true>[]>;
 deleteSuggestions: DeleteSuggestions;
 vcDeleteTimeout: VcDeleteTimeout;
 interactedGuilds: Set<string>;

 // URLs
 urlTLDs: UrlTLDs;
 sinkingYachts: SinkingYachts;
 fishFish: FishFish;

 globalLevellingCD: Set<string>;
 guildLevellingCD: Set<string>;
 lastMessageGlobal: Map<string, string>;
 lastMessageGuild: Map<string, string>;
 afkCD: Map<string, Set<string>>;
 cooldown: Map<string, Map<string, number>>;
 antiraid: Map<string, Set<Discord.GuildMember>>;
 antiraidQueued: Set<string>;
 enableInvites: Map<string, Jobs.Job>;
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
 interactedGuilds: new Set(),

 // Cache
 giveawayClaimTimeout,
 mutes,
 bans,
 channelBans,
 reminders,
 disboardBumpReminders,
 votes,
 giveaways,
 stickyTimeouts,
 auditLogs,
 deleteThreads,
 apis: new Map(),
 commands,
 punishments: new Set(),
 antispam: new Map(),
 deleteSuggestions,
 vcDeleteTimeout,

 // URLs
 urlTLDs,
 sinkingYachts,
 fishFish,

 globalLevellingCD: new Set(),
 guildLevellingCD: new Set(),
 lastMessageGlobal: new Map(),
 lastMessageGuild: new Map(),
 afkCD: new Map(),
 cooldown: new Map(),
 antiraid: new Map(),
 antiraidQueued: new Set(),
 enableInvites: new Map(),
};

export default cache;
