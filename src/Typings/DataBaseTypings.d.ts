import Prisma from '@prisma/client';

export interface DBTables {
 afk: Prisma.afk;
 balance: Prisma.balance;
 customembeds: Prisma.customembeds;
 giveaways: Prisma.giveaways;
 level: Prisma.level;
 punish_bans: Prisma.punish_bans;
 punish_kicks: Prisma.punish_kicks;
 punish_mutes: Prisma.punish_mutes;
 punish_tempbans: Prisma.punish_tempbans;
 punish_tempmutes: Prisma.punish_tempmutes;
 punish_warns: Prisma.punish_warns;
 punish_channelbans: Prisma.punish_channelbans;
 punish_tempchannelbans: Prisma.punish_tempchannelbans;
 reminders: Prisma.reminders;
 roleseparatorsettings: Prisma.roleseparatorsettings;
 rrbuttons: Prisma.rrbuttons;
 stickypermmembers: Prisma.stickypermmembers;
 stickyrolemembers: Prisma.stickyrolemembers;
 suggestionvotes: Prisma.suggestionvotes;
 users: Prisma.users;
 giveawaycollection: Prisma.giveawaycollection;
 voters: Prisma.voters;
 stickymessages: Prisma.stickymessages;
 nitrousers: Prisma.nitrousers;
 stats: Prisma.stats;
 reviews: Prisma.reviews;
 art: Prisma.art;
 guilds: Prisma.guilds;
 contributers: Prisma.contributers;
 appeals: Prisma.appeals;
 filterscraper: Prisma.filterscraper;
 antiraid: Prisma.antiraid;
 antispam: Prisma.antispam;
 antivirus: Prisma.antivirus;
 autopunish: Prisma.autopunish;
 autoroles: Prisma.autoroles;
 blacklist: Prisma.blacklist;
 cooldowns: Prisma.cooldowns;
 disboard: Prisma.disboard;
 guildsettings: Prisma.guildsettings;
 leveling: Prisma.leveling;
 levelingmultichannels: Prisma.levelingmultichannels;
 levelingroles: Prisma.levelingroles;
 levelingruleschannels: Prisma.levelingruleschannels;
 logchannels: Prisma.logchannels;
 expiry: Prisma.expiry;
 nitroroles: Prisma.nitroroles;
 nitrosettings: Prisma.nitrosettings;
 roleseparator: Prisma.roleseparator;
 buttonroles: Prisma.buttonroles;
 reactionroles: Prisma.reactionroles;
 reactionrolesettings: Prisma.reactionrolesettings;
 buttonrolesettings: Prisma.buttonrolesettings;
 selfroles: Prisma.selfroles;
 sticky: Prisma.sticky;
 suggestionsettings: Prisma.suggestionsettings;
 verification: Prisma.verification;
 welcome: Prisma.welcome;
 levelingmultiroles: Prisma.levelingmultiroles;
 votesettings: Prisma.votesettings;
 voterewards: Prisma.voterewards;
 appealsettings: Prisma.appealsettings;
 appealquestions: Prisma.appealquestions;
 rolerewards: Prisma.rolerewards;
}

export type PunishmentType =
 | 'warn'
 | 'kick'
 | 'tempmute'
 | 'ban'
 | 'tempban'
 | 'channelban'
 | 'tempchannelban';

export type LevelType = 'guild' | 'global';

export type LevelGuild = string | '1';
