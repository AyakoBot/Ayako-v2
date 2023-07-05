import type { QueryResultBase } from 'pg';
import * as SettingsTypes from './Settings';

export * from './Settings';
export const Res = QueryResultBase;

export interface DBTables {
 Punishment: Punishment;
 unknown: unknown;

 afk: afk;
 customembeds: customembeds;
 giveaways: giveaways;
 level: level;
 punish_bans: punish_bans;
 punish_kicks: punish_kicks;
 punish_mutes: punish_mutes;
 punish_tempbans: punish_tempbans;
 punish_tempmutes: punish_tempmutes;
 punish_warns: punish_warns;
 punish_tempchannelbans: punish_tempchannelbans;
 reminders: reminders;
 roleseparatorsettings: roleseparatorsettings;
 rrbuttons: rrbuttons;
 stickypermmembers: stickypermmembers;
 stickyrolemembers: stickyrolemembers;
 suggestionvotes: suggestionvotes;
 users: users;
 giveawaycollection: giveawaycollection;
 voters: voters;
 stickymessages: stickymessages;
 nitrousers: nitrousers;
 stats: stats;
 reviews: reviews;
 art: art;
 guilds: guilds;
 contributers: contributers;
 appeals: appeals;
 filterscraper: filterscraper;
 antiraid: SettingsTypes.antiraid;
 antispam: SettingsTypes.antispam;
 antivirus: SettingsTypes.antivirus;
 autopunish: SettingsTypes.autopunish;
 autoroles: SettingsTypes.autoroles;
 blacklist: SettingsTypes.blacklist;
 cooldowns: SettingsTypes.cooldowns;
 deletecommands: SettingsTypes.deletecommands;
 disboard: SettingsTypes.disboard;
 guildsettings: SettingsTypes.guildsettings;
 leveling: SettingsTypes.leveling;
 levelingmultichannels: SettingsTypes.levelingmultichannels;
 levelingroles: SettingsTypes.levelingroles;
 levelingruleschannels: SettingsTypes.levelingruleschannels;
 logchannels: SettingsTypes.logchannels;
 expiry: SettingsTypes.expiry;
 nitroroles: SettingsTypes.nitroroles;
 nitrosettings: SettingsTypes.nitrosettings;
 roleseparator: SettingsTypes.roleseparator;
 buttonroles: SettingsTypes.buttonroles;
 reactionroles: SettingsTypes.reactionroles;
 reactionrolesettings: SettingsTypes.reactionrolesettings;
 buttonrolesettings: SettingsTypes.buttonrolesettings;
 selfroles: SettingsTypes.selfroles;
 statschannel: SettingsTypes.statschannel;
 sticky: SettingsTypes.sticky;
 suggestionsettings: SettingsTypes.suggestionsettings;
 verification: SettingsTypes.verification;
 welcome: SettingsTypes.welcome;
 levelingmultiroles: SettingsTypes.levelingmultiroles;
 votesettings: SettingsTypes.votesettings;
 punishments_blacklist: SettingsTypes.punishments_blacklist;
 punishments_antispam: SettingsTypes.punishments_antispam;
 punishments_antivirus: SettingsTypes.punishments_antivirus;
 voterewards: SettingsTypes.voterewards;
 appealsettings: SettingsTypes.appealsettings;
 appealquestions: SettingsTypes.appealquestions;
 rolerewards: SettingsTypes.rolerewards;
}

// Tables
export type afk = {
 userid: string;
 guildid: string;
 text?: string;
 since: string;
};

export type customembeds = {
 name: string;
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
 winnercount: string;
 endtime: string;
 host: string;
 ended: boolean;
 channelid: string;
 participants: string[];
 reqrole?: string;
 actualprize?: string;
 description: string;
 collecttime?: number;
 failreroll?: boolean;
 claimingdone: boolean;
 winners: string[];
};

export type level = {
 userid: string;
 guildid: string | '1';
 type: 'guild' | 'global';
 xp: string;
 level?: string;
};

export type BasicPunishmentsTable = {
 guildid: string;
 uniquetimestamp: string;
 active: boolean;

 punishment:
  | 'warn'
  | 'ban'
  | 'verbal'
  | 'kick'
  | 'tempmute'
  | 'tempban'
  | 'channelban'
  | 'tempchannelban';
 warnamount: string;
 duration: string;
};

export interface Punishment {
 guildid: string;
 userid: string;
 reason?: string;
 uniquetimestamp: string;
 channelid: string;
 channelname: string;
 executorid: string;
 executorname: string;
 msgid: string;
}

export interface TempPunishment extends Punishment {
 duration?: string;
}

export type punish_kicks = Punishments;
export type punish_mutes = TempPunishment;
export type punish_tempbans = TempPunishment;
export type punish_bans = TempPunishment;
export type punish_tempmutes = TempPunishment;
export type punish_warns = Punishment;
export type punish_channelbans = TempPunishment & { banchannelid: string };
export type punish_tempchannelbans = TempPunishment & { banchannelid: string };

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
 votereminders: boolean;
 username: string;
 avatar: string;
 socials?: string[];
 socialstype?: string[];
 lastfetch: string;
 email?: string;
 refreshtoken?: string;
 expires?: string;
 accesstoken?: string;
 ptremindersent: boolean;
};

export interface giveawaycollection {
 msgid: string;
 guildid: string;
 endtime: string;
 replymsgid: string;
 requiredwinners: string[];
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
 lastmsgid: string;
 channelid: string;
 userid: string;
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
 antispam: boolean;
 verbosity: boolean;
 heartbeat: string;
};

export type reviews = {
 userid: string;
 score: string;
 username: string;
 avatar?: string;
 content: string;
};

export type art = {
 userid: string;
 created: string;
 url: string;
 type: string;
 verified: boolean;
};

export type guilds = {
 guildid: string;
 name: string;
 icon?: string;
 banner?: string;
 invite?: string;
 membercount: string;
};

export type contributers = {
 userid: string;
 roles?: string[];
};

export type appeals = {
 userid: string;
 guildid: string;
 questions?: string[];
 answers?: string[];
 questiontypes?: string[];
 punishmentid: string;
};

export type filterscraper = {
 keyword: string;
 filtertype: string;
};
