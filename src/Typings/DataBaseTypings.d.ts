import type { QueryResultBase } from 'pg';

export * from './Settings';
export const Res = QueryResultBase;

// Tables
export type afk = {
  userid: string;
  guildid: string;
  text: string;
  since: string;
};

export type customembeds = {
  name?: string;
  guildid: string;
  uniquetimestamp: string;

  color?: string;
  title?: string;
  url?: string;
  authorname?: string;
  authoricon_url?: string;
  authorurl?: string;
  description?: string;
  thumbnail?: string;
  fieldnames?: string[];
  fieldvalues?: string[];
  fieldinlines?: boolean[];
  image?: string;
  timestamp?: string;
  footertext?: string;
  footericon_url?: string;
};

export type giveaways = {
  guildid: string;
  msgid: string;
  description: string;
  winnercount: string;
  endtime: string;
  reqrole?: string;
  actualprize?: string;
  host: string;
  ended: boolean;
  channelid: string;
  participants?: string[];
  collecttime?: number;
};

export type level = {
  userid: string;
  guildid: string | '1';
  type: 'guild' | 'global';
  xp: string;
  level?: string;
};

export type policy_guilds = {
  guildid: string;
};

export type policy_users = {
  userid: string;
};

export type BasicPunishmentsTable = {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  punishment: string;
  warnamount: string;
  duration: string;
};

export type punish_bans = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
  duration?: string;
};

export type punish_channelbans = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
  duration?: string;
  banchannelid: string;
};

export type punish_kicks = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
};

export type punish_mutes = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
  duration?: string;
};

export type punish_tempbans = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
  duration: string;
};

export type punish_tempchannelbans = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
  duration: string;
  banchannelid: string;
};

export type punish_tempmutes = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
  duration: string;
};

export type punish_warns = {
  guildid: string;
  userid: string;
  reason?: string;
  uniquetimestamp: string;
  channelid: string;
  channelname: string;
  executorid: string;
  executorname: string;
  msgid: string;
};

export type reminders = {
  userid: string;
  channelid: string;
  reason: string;
  uniquetimestamp: string;
  endtime: string;
  msgid: string;
};

export type roleseparatorsettings = {
  guildid: string;
  stillrunning: boolean;
  channelid?: string;
  messageid?: string;
  duration?: string;
  startat?: string;
  index?: string;
  length?: string;
};

// TODO
export type rrbuttons = {
  uniquetimestamp: string;
  guildid: string;
  active: boolean;

  roles?: string[];
  emoteid?: string;
  buttontext?: string;
  messagelink: string;
};

export type stickypermmembers = {
  userid: string;
  guildid: string;
  channelid: string;
  denybits?: bigint;
  allowbits?: bigint;
};

export type stickyrolemembers = {
  userid: string;
  guildid: string;
  roles: string[];
};

export type suggestionvotes = {
  guildid: string;
  msgid: string;
  authorid: string;
  downvoted?: string[];
  upvoted?: string[];
  ended?: boolean;
};

export type users = {
  userid: string;
  votereminders?: boolean;
};

export interface giveawaycollecttime {
  userid: string;
  prize: string;
  msgid: string;
  endtime: number;
  guildid: string;
}

export type voters = {
  userid: string;
  removetime: string;
  voted: string;
  votetype: 'guild' | 'bot';
  tier: string;

  rewardroles?: string[];
  rewardxp?: string;
  rewardcurrency?: number;
  rewardxpmultiplier?: number;
};

export type stickymessages = {
  guildid: string;
  uniquetimestamp: string;
  lastmsgid: string;
  channelid: strin;
};

export type nitrousers = {
  guildid: string;
  userid: string;
  booststart: string;
  boostend?: string;
  days?: number;
};

export type stats = {
  usercount: string;
  guildcount: string;
  channelcount: string;
  rolecount: string;
  allusers: string;
  willis?: string[];
  count?: string;
  antispam: boolean;
  verbosity: boolean;
  heartbeat: string;
};
