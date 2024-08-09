export interface TopGGVote {
 bot: string;
 user: string;
 type: 'upvote' | 'test';
 isWeekend?: boolean;
 query?: string;
 authorization: string;
}

type SuccessfulTopGGResponse = {
 username: string;
 id: string;
 discriminator: string;
 avatar: string;
 defAvatar: string;
 prefix: string;
 shortdesc: string;
 longdesc: string;
 tags?: string[];
 website: string;
 support: string;
 github: string;
 owners: string[];
 guilds: string[];
 invite: string;
 date: string;
 server_count: number;
 shard_count: string;
 certifiedBot: string;
 vanity: string;
 points: number;
 monthlyPoints: number;
 donatebotguildid: string;
};

type FailedTopGGResponse = { error: string };

export type TopGGResponse<T extends boolean> = T extends true
 ? SuccessfulTopGGResponse
 : FailedTopGGResponse;

export type TopGGUser = {
 id: string;
 username: string;
 avatar: string;
};

export type TopGGExtendedUser = {
 user: TopGGUser & {
  badges: number;
  banner?: string;
  bio?: string;
  connections: { id: string; type: 'discord' }[];
  permissions: number;
  preferredNsfwLevel: number;
  isPremium: false;
  internalUserId: string;
 };
 bannedOnDiscord: boolean;
};

export type TopGGAnnouncement = {
 id: string;
 published: boolean;
 icon: string;
 title: string;
 content: string;
 date: string; // Date String
};

export type TopGGServer = {
 id: string;
 teamId?: string;
 icon: string; // hash, not URL
 name: string;
 bots: string[];
 shortDesc: string;
 longDesc: string;
 splashURL?: string;
 websiteURL?: string;
 donateURL?: string;
 memberCount: number;
 monthlyPoints: number;
 points: number;
 joinDate: string; // Unix Timestamp
 published: boolean;
 emotes: string[]; // Emoji URL
 tags: string[];
 languages: string[]; // Language codes
 owners: string[];
 verified: boolean;
 announcements: TopGGAnnouncement[];
 blacklisted: boolean;
 twitterHandle?: string;
 redditHandle?: string;
 telegramHandle?: string;
 tiktokHandle?: string;
 instagramHandle?: string;
 facebookHandle?: string;
 youtubeHandle?: string;
 nsfwLevel: number;
 isPrivate: boolean;
 applicationFormUrl: string;
 type: 'server';
 platform: 'discord';
};

export type TopGGReview = {
 id: string;
 internalEntityId: string;
 entityId: string;
 posterId: string;
 score: number; // up to 100 in 20 steps
 content: string;
 reply?: {
  id: string;
  posterId: string;
  content: string;
  poster: TopGGUser;
 };
 hasVoted: boolean;
 isFlagged: boolean;
 timestamp: string; // Date String
 editedAt?: string; // Date String
 flaggedAt?: string; // Date String
 votes: number;
 poster: TopGGUser;
};

export type TopGGBotPage = {
 pageProps: {
  helpdesk?: TopGGServer;
  team?: unknown;
  entity: TopGGEntity;
  role?: unknown;
  isMobile: boolean;
  canReview: boolean;
  creators: TopGGExtendedUser[];
  reviewStats: {
   entityId: string;
   reviewCount: number;
   averageScore: number;
  };
  canEditEntity?: boolean;
  relatedEntities: {
   entityId: string;
   name: string;
   entityType: 'server';
   iconUrl: string;
  }[];
  entityInternalId: boolean;
  reviewPage: number;
  activeAnnouncement: null;
  renderedDescription: string;
  serverBotId: string;
 };
};

export type TopGGEntity = {
 id: string;
 teamId?: string;
 clientid: string;
 username: string;
 discriminator: string;
 avatar: string; // hash, not URL
 defAvatar: string; // hash, not URL
 lib: string;
 prefix: string;
 shortdesc: string;
 longdesc: string;
 tags: string[];
 languages: [];
 website?: string;
 support?: string;
 github?: string;
 owners: string[];
 guilds?: string[];
 approved: boolean;
 certifiedBot: boolean;
 vanity?: string;
 botCardBg?: string;
 monthlyPoints: string;
 points: string;
 vimeo?: string;
 shard_count?: number;
 server_count?: number;
 theme?: unknown;
 announcements: unknown[];
 donatebotguildid: null;
 invite: string;
 communityGuildId?: string;
 twitterHandle?: string;
 redditHandle?: string;
 telegramHandle?: string;
 tiktokHandle?: string;
 instagramHandle?: string;
 facebookHandle?: string;
 youtubeHandle?: string;
 noteForReviewer?: string;
 type: 'bot';
 platform: 'discord';
};

export type TopGGUserPage = {
 pageProps: {
  lists: [
   {
    entities: TopGGEntity[];
    type: 'bot';
    platform: 'discord';
    titleId: string;
   },
  ];
  discordId: string;
  isOwnProfile: boolean;
  unaddedGuilds: string[];
  profile: {
   id: string;
   avatar: string;
   username: string;
   badges: string;
   banner?: string;
   bio: string;
   connections: [
    {
     id: string;
     type: 'discord';
    },
   ];
   permissions: number;
   preferredNsfwLevel: number;
   isPremium: boolean;
   internalUserId: string;
  };
  discordDisplayName: string;
  botClientId: string;
  isPrivilegedViewer: boolean;
  teams: [];
 };
};
