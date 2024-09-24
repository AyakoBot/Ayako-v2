import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import auditLogs, { type AuditLogs } from './cache/discord/auditLogs.js';
import commandPermissions, { type CommandPermissions } from './cache/discord/commandPermissions.js';
import commands, { type Commands } from './cache/discord/commands.js';
import integrations, { type Integrations } from './cache/discord/integrations.js';
import inviteGuilds, { type InviteGuilds } from './cache/discord/inviteGuilds.js';
import invites, { type Invites } from './cache/discord/invites.js';
import onboarding, { type Onboarding } from './cache/discord/onboarding.js';
import pins, { type Pins } from './cache/discord/pins.js';
import scheduledEventUsers, {
 type ScheduledEventUsers,
} from './cache/discord/scheduledEventUsers.js';
import webhooks, { type Webhooks } from './cache/discord/webhooks.js';
import welcomeScreens, { type WelcomeScreens } from './cache/discord/welcomeScreens.js';

import bans, { type Bans } from './cache/bot/bans.js';
import channelBans, { type ChannelBans } from './cache/bot/channelBans.js';
import deleteSuggestions, { type DeleteSuggestions } from './cache/bot/deleteSuggestions.js';
import deleteThreads, { type DeleteThreads } from './cache/bot/deleteThreads.js';
import disboardBumpReminders, {
 type DisboardBumpReminders,
} from './cache/bot/disboardBumpReminders.js';
import gifs from './cache/bot/gifs.js';
import giveawayClaimTimeout, {
 type GiveawayClaimTimeout,
} from './cache/bot/giveawayClaimTimeout.js';
import giveaways, { type Giveaways } from './cache/bot/giveaways.js';
import mutes, { type Mutes } from './cache/bot/mutes.js';
import reminders, { type Reminders } from './cache/bot/reminders.js';
import stickyTimeouts, { type StickyTimeouts } from './cache/bot/stickyTimeouts.js';
import unblockedModUsers, { type UnblockedModUsers } from './cache/bot/unblockedModUsers.js';
import vcDeleteTimeout, { type VcDeleteTimeout } from './cache/bot/vcDeleteTimeout.js';
import votes, { type Votes } from './cache/bot/votes.js';

import fishFish, { type FishFish } from './cache/urls/fishFish.js';
import sinkingYachts, { type SinkingYachts } from './cache/urls/sinkingYachts.js';
import urlTLDs, { type UrlTLDs } from './cache/urls/urlTLDs.js';

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
 interactedChannels: Set<string>;
 fastMsgCache: Map<string, { msgs: Discord.Message[]; job: Jobs.Job }>;
 interactionInstallmentRunningFor: Set<string>;
 unblockedModUsers: UnblockedModUsers;
 gifs: typeof gifs;
 latelySavedUsers: Map<string, number>;
 hasFetchedAllMembers: Set<string>;
 customClients: Map<string, string>;

 // URLs
 urlTLDs: UrlTLDs;
 sinkingYachts: SinkingYachts;
 fishFish: FishFish;
 reportedURLs: Set<string>;

 globalLevellingCD: Set<string>;
 guildLevellingCD: Set<string>;
 lastMessageGlobal: Map<string, string>;
 lastMessageGuild: Map<string, string>;
 afkCD: Map<string, Set<string>>;
 cooldown: Map<string, Map<string, number>>;
 antiraid: Map<string, Set<Discord.GuildMember>>;
 antiraidQueued: Set<string>;
 enableInvites: Map<string, Jobs.Job>;
 separatorAssigner: Map<string, Jobs.Job[]>;
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
 interactedChannels: new Set(),
 customClients: new Map(),

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
 fastMsgCache: new Map(),
 interactionInstallmentRunningFor: new Set(),
 unblockedModUsers,
 gifs,
 latelySavedUsers: new Map(),
 hasFetchedAllMembers: new Set(),

 // URLs
 urlTLDs,
 sinkingYachts,
 fishFish,
 reportedURLs: new Set(),

 globalLevellingCD: new Set(),
 guildLevellingCD: new Set(),
 lastMessageGlobal: new Map(),
 lastMessageGuild: new Map(),
 afkCD: new Map(),
 cooldown: new Map(),
 antiraid: new Map(),
 antiraidQueued: new Set(),
 enableInvites: new Map(),
 separatorAssigner: new Map(),
};

export default cache;
