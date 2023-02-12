import type { QueryResultBase } from 'pg';

export const Res = QueryResultBase;

// Tables
export type afk = {
  userid: string;
  guildid: string;
  text: string;
  since: string;
};

export type antiraid = {
  guildid: string;
  active: boolean;

  punishmenttof?: boolean;
  punishment: string;

  posttof?: boolean;
  postchannel?: string;

  time: string;
  jointhreshold: string;

  pingroles?: string[];
  pingusers?: string[];
};

export type antispam = {
  forcedisabled?: boolean;
  guildid: string;
  active: boolean;

  msgthreshold: string;
  dupemsgthreshold: string;
  timeout: string;
  deletespam: boolean;

  wluserid?: string[];
  wlroleid?: string[];
  wlchannelid?: string[];
};

export type antivirus = {
  guildid: string;
  active: boolean;

  minimizetof: boolean;
  minimize?: string;

  deletetof: boolean;
  delete?: string;

  linklogging: boolean;
  linklogchannels?: string[];
};

export type autopunish = {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  warnamount: string;
  punishment?: string;
  duration?: string;

  confirmationreq: boolean;
  punishmentawaittime: string;

  addroles?: string[];
  removeroles?: string[];
};

export type autoroles = {
  guildid: string;
  active: boolean;

  botroleid?: string[];
  userroleid?: string[];
  allroleid?: string[];
};

export type blacklist = {
  guildid: string;
  active: boolean;

  words?: string[];

  wlchannelid?: string[];
  wlroleid?: string[];
  wluserid?: string[];
};

export type cooldowns = {
  uniquetimestamp: string;
  guildid: string;
  active: boolean;

  command: string;
  cooldown: string;

  activechannelid?: string[];
  wlchannelid?: string[];

  wlroleid?: string[];
  wluserid?: string[];
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

export type deletecommands = {
  uniquetimestamp: string;
  guildid: string;
  active: boolean;

  command: string;
  deletetimeout?: string;

  deletecommand: boolean;
  deletereply: boolean;

  wlchannelid: string[];
  activechannelid: string[];
};

export type disboard = {
  guildid: string;
  nextbump?: string;
  tempchannelid?: string;
  msgid?: string;
  active: boolean;

  deletereply: boolean;
  channelid?: string;

  repeatenabled: boolean;
  repeatreminder: string;

  roles?: string[];
  users?: string[];
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

export type guildsettings = {
  guildid: string;

  prefix?: string;
  interactionsmode: boolean;
  lan: string;
  errorchannel?: string;
};

export type level = {
  userid: string;
  guildid: string | '1';
  type: 'guild' | 'global';
  xp: string;
  level?: string;
};

export type leveling = {
  guildid: string;
  active: boolean;

  xppermsg: string;
  xpmultiplier: string;
  rolemode: boolean;

  lvlupmode?: string;
  // saved as ID
  lvlupemotes?: string[];
  lvlupdeltimeout?: string;
  embed?: string;
  lvlupchannels?: string[];

  ignoreprefixes: boolean;
  prefixes?: string[];

  blchannels?: string[];
  blroles?: string[];
  blusers?: string[];
  wlchannels?: string[];
  wlroles?: string[];
  wlusers?: string[];
};

export type levelingmultichannels = {
  uniquetimestamp: string;
  guildid: string;

  channels?: string[];
  multiplier: string;
};

export type levelingmultiroles = {
  guildid: string;
  uniquetimestamp: string;

  roles?: string[];
  multiplier: string;
};

export type levelingroles = {
  guildid: string;
  uniquetimestamp: string;

  level?: string;
  roles?: string[];
};

export type levelingruleschannels = {
  uniquetimestamp: string;
  guildid: string;

  rules?: string;
  channels?: string[];

  hasleastattachments?: string;
  hasmostattachments?: string;
  hasleastcharacters?: string;
  hasmostcharacters?: string;
  hasleastwords?: string;
  hasmostwords?: string;
  mentionsleastusers?: string;
  mentionsmostusers?: string;
  mentionsleastchannels?: string;
  mentionsmostchannels?: string;
  mentionsleastroles?: string;
  mentionsmostroles?: string;
  hasleastlinks?: string;
  hasmostlinks?: string;
  hasleastemotes?: string;
  hasmostemotes?: string;
  hasleastmentions?: string;
  hasmostmentions?: string;
};

export type logchannels = {
  guildid: string;

  applicationevents: string[];
  automodevents: string[];
  channelevents: string[];
  emojievents: string[];
  guildevents: string[];
  scheduledeventevents: string[];
  inviteevents: string[];
  messageevents: string[];
  roleevents: string[];
  stageevents: string[];
  stickerevents: string[];
  typingevents: string[];
  userevents: string[];
  voiceevents: string[];
  webhookevents: string[];
  settingslog: string[];
  modlog: string[];
  reactionevents: string[];
  memberevents: string[];
};

export type expiry = {
  guildid: string;

  bans: boolean;
  banstime?: string;

  channelbans: boolean;
  channelbanstime?: string;

  kicks: boolean;
  kickstime?: string;

  mutes: boolean;
  mutestime?: string;

  warns: boolean;
  warnstime?: string;
};

export type nitroroles = {
  guildid: string;
  uniquetimestamp: string;

  roles?: string[];
  days?: string;
};

export type nitrosettings = {
  guildid: string;
  active: boolean;

  logchannels?: string[];
  rolemode: boolean;
};

export type nitrousers = {
  guildid: string;
  userid: string;
  booststart: string;
  boostend?: string;
  days?: number;
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

export type roleseparator = {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  separator: string;
  stoprole?: string;
  isvarying: boolean;
  roles?: string[];
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

// TODO
export type rrreactions = {
  uniquetimestamp: string;
  active: boolean;
  guildid: string;

  emoteid: string;
  roles?: string[];
  messagelink: string;
};

// TODO
export type rrsettings = {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  messagelink: string;
  name: string;

  onlyone?: boolean;
  anyroles?: string[];
};

export type selfroles = {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  name: string;
  onlyone: boolean;

  roles?: string[];
  blroles?: string[];
  blusers?: string[];
  wlroles?: string[];
  wlusers?: string[];
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

export type statschannel = {
  guildid: string;
  channelid: string;
  type?: string;
};

export type sticky = {
  guildid: string;

  stickypermsactive: boolean;
  stickyrolesactive: boolean;

  stickyrolesmode: boolean;
  roles?: string[];
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

export type suggestionsettings = {
  guildid: string;
  active: boolean;

  channelid?: string;
  approverroleid?: string[];

  anonvote: boolean;
  anonsuggestion: boolean;

  novoteroles?: string[];
  novoteusers?: string[];

  nosendroles?: string[];
  nosendusers?: string[];
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

export type verification = {
  guildid: string;
  active: boolean;

  selfstart: boolean;
  startchannel?: string;
  logchannel?: string;

  pendingrole?: string;
  finishedrole?: string;

  kicktof: boolean;
  kickafter?: string;
};

export type welcome = {
  guildid: string;
  active: boolean;

  channelid?: string;
  embed: string;
  pingjoin: boolean;

  pingroles?: string[];
  pingusers?: string[];
};

export type levelingmultiroles = {
  uniquetimestamp: string;
  guildid: string;

  roles?: string[];
  multiplier?: number;
};

export interface giveawaycollecttime {
  userid: string;
  prize: string;
  msgid: string;
  endtime: number;
  guildid: string;
}

export interface votesettings {
  guildid: string;
  active: boolean;

  token: string;
  reminders: boolean;
  announcementchannel: string;
}

type RewardType = 'role' | 'currency' | 'xp' | 'xpmultiplier';

export interface voterewards {
  guildid: string;
  uniquetimestamp: string;

  tier: number;
  rewardtype?: RewardType;
  reward: string;
}

export type voters = {
  userid: string;
  removetime: string;
  voted: string;
  votetype: 'guild' | 'bot';
  tier: string;
  rewardtype: RewardType[];
  reward: string[];
};

export type stickymessages = {
  guildid: string;
  uniquetimestamp: string;
  lastmsgid: string;
  channelid: strin;
};
