import type * as DBT from './DataBaseTypings';

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
  usestrike: boolean;

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
  usestrike: boolean;

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
  usestrike: boolean;

  words?: string[];

  wlchannelid?: string[];
  wlroleid?: string[];
  wluserid?: string[];
};

export type cooldowns = {
  uniquetimestamp: string;
  guildid: string;
  active: boolean;

  command?: string;
  cooldown: string;

  activechannelid?: string[];
  wlchannelid?: string[];

  wlroleid?: string[];
  wluserid?: string[];
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

export type guildsettings = {
  guildid: string;
  prefix?: string;
  interactionsmode: boolean;
  lan: string;
  errorchannel?: string;
};

export type leveling = {
  guildid: string;
  active: boolean;

  xppermsg: string;
  xpmultiplier: string;
  rolemode: boolean;

  lvlupmode?: string;
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

export type roleseparator = {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  separator: string;
  stoprole?: string;
  isvarying: boolean;
  roles?: string[];
};

export type buttonroles = {
  uniquetimestamp: string;
  guildid: string;
  active: boolean;

  emote: string;
  text: string;

  roles?: string[];
  linkedid?: string;
};

export type reactionroles = {
  uniquetimestamp: string;
  guildid: string;
  active: boolean;

  emote: string;

  roles?: string[];
  linkedid?: string;
};

export type reactionrolesettings = {
  uniquetimestamp: string;
  active: boolean;

  onlyone: boolean;
  anyroles?: string[];

  guildid: string;
  msgid?: string;
  channelid?: string;
};

export type buttonrolesettings = {
  uniquetimestamp: string;
  active: boolean;

  onlyone: boolean;
  anyroles?: string[];

  guildid: string;
  msgid?: string;
  channelid?: string;
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

// TODO
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

export type suggestionsettings = {
  guildid: string;
  active: boolean;

  channelid?: string;
  approverroleid?: string[];
  pingroleid?: string[];
  pinguserid?: string[];

  anonvote: boolean;
  anonsuggestion: boolean;

  novoteroles?: string[];
  novoteusers?: string[];

  nosendroles?: string[];
  nosendusers?: string[];
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

export interface votesettings {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  token?: string;
  reminders: boolean;
  announcementchannel?: string;
}

export type punishments_blacklist = DBT.BasicPunishmentsTable;
export type punishments_antispam = DBT.BasicPunishmentsTable;
export type punishments_antivirus = DBT.BasicPunishmentsTable;

export interface voterewards {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  tier?: string;
  rewardxp?: string;
  rewardxpmultiplier?: string;
  rewardcurrency?: string;
  rewardroles?: string[];
  linkedid?: string;
}

export type appealsettings = {
  guildid: string;
  active: boolean;

  channelid?: string;
  blusers?: string[];
};

export type appealquestions = {
  guildid: string;
  uniquetimestamp: string;
  active: boolean;

  question?: string;
  answertype?: 'paragraph' | 'short' | 'number' | 'boolean' | 'multiple choice' | 'single choice';
  required: boolean;
  options?: string[];
};
