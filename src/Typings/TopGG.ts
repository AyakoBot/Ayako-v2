export interface TopGGBotVote {
 bot: string;
 user: string;
 type: 'upvote' | 'test';
 isWeekend: boolean;
 query?: string;
 authorization: string;
}

export interface TopGGGuildVote {
 guild: string;
 user: string;
 type: 'upvote' | 'test';
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
