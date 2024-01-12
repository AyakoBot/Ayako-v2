import * as Discord from 'discord.js';
import merge from 'lodash.merge';
import client from '../Bot/Client.js';
import stp from '../UtilModules/stp.js';
import languageFunction from './language/languageFunction.js';
import events from './language/events/events.js';
import time from './language/time.js';
import channelTypes from './language/channelTypes.js';
import verification from './language/verification.js';
import expire from './language/expire.js';
import channelRules from './language/channelRules.js';
import auditLogAction from './language/auditLogAction.js';
import defaultSortOrder from './language/defaultSortOrder.js';
import defaultForumLayout from './language/defaultForumLayout.js';
import defaultAutoArchiveDuration from './language/defaultAutoArchiveDuration.js';
import autotypes from './language/autotypes.js';
import antivirus from './language/antivirus.js';
import censor from './language/censor.js';
import slashCommands from './language/slashCommands.js';
import nitro from './language/nitro.js';
import mod from './language/mod.js';
import leveling from './language/leveling.js';

import enJSON from '../../Languages/en-GB.json' assert { type: 'json' };
import deJSON from '../../Languages/de-DE.json' assert { type: 'json' };

export const languages = {
 'en-GB': enJSON,
 'en-US': enJSON,
 'de-DE': deJSON,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mergeLang = <T extends Record<string, any>>(lang: T) =>
 merge({}, languages['en-GB'], lang) as T & (typeof languages)['en-GB'];

const t = (lan: ReturnType<typeof mergeLang>) => ({
 ...lan.t,
 welcome: (user: Discord.User, guild: Discord.Guild) => stp(lan.t.welcome, { user, guild }),
 defaultValuesLog: (oldValue: string, newValue: string) =>
  stp(lan.t.welcome, { oldValue, newValue }),
 pageBetween: (x: number, y: number) => stp(lan.t.pageBetween, { x, y }),
 voiceHub: (u: Discord.User) => stp(lan.t.voiceHub, { u }),
});

export default class Language {
 botName = client.user?.username ?? 'Ayako';
 botId = client.user?.id;
 CURRENT_LANGUAGE: keyof typeof languages = 'en-GB';
 JSON: (typeof languages)['en-GB'] = mergeLang(languages['en-GB']);
 stp = stp;
 util = client.util;

 t: ReturnType<typeof t>;

 permissions: typeof this.JSON.permissions;
 userFlags: typeof this.JSON.userFlags;
 punishmentAction: typeof this.JSON.punishmentAction;
 punishmentDeleteMessageSeconds: typeof this.JSON.punishmentDeleteMessageSeconds;
 contextCommands: typeof this.JSON.contextCommands;
 linkedid: typeof this.JSON.linkedid;
 multiplier: typeof this.JSON.multiplier;
 holdhands: typeof this.JSON.holdhands;
 punishments: typeof this.JSON.punishments;
 punishmentDuration: typeof this.JSON.punishmentDuration;
 shoptypes: typeof this.JSON.shoptypes;
 answertypes: typeof this.JSON.answertypes;
 commandTypes: typeof this.JSON.commandTypes;
 languages: typeof this.JSON.languages;
 features: typeof this.JSON.features;
 deleteReasons: typeof this.JSON.deleteReasons;
 regions: typeof this.JSON.regions;
 rolemodes: typeof this.JSON.rolemodes;
 scopes: typeof this.JSON.scopes;
 errors: typeof this.JSON.errors;
 lvlupmodes: typeof this.JSON.lvlupmodes;

 leveling: ReturnType<typeof leveling>;
 time: ReturnType<typeof time>;
 languageFunction: ReturnType<typeof languageFunction>;
 events: ReturnType<typeof events>;
 channelTypes: ReturnType<typeof channelTypes>;
 verification: ReturnType<typeof verification>;
 expire: ReturnType<typeof expire>;
 slashCommands: ReturnType<typeof slashCommands>;
 nitro: ReturnType<typeof nitro>;
 mod: ReturnType<typeof mod>;
 censor: ReturnType<typeof censor>;
 antivirus: ReturnType<typeof antivirus>;
 autotypes: ReturnType<typeof autotypes>;
 channelRules: ReturnType<typeof channelRules>;
 defaultAutoArchiveDuration: ReturnType<typeof defaultAutoArchiveDuration>;
 defaultForumLayout: ReturnType<typeof defaultForumLayout>;
 defaultSortOrder: ReturnType<typeof defaultSortOrder>;
 auditLogAction: { [key in Discord.GuildAuditLogsEntry['action']]: string };

 constructor(type: keyof typeof languages) {
  this.CURRENT_LANGUAGE = type;

  this.JSON = mergeLang(languages[this.CURRENT_LANGUAGE]);
  if (!this.JSON) this.JSON = mergeLang(languages['en-GB']);

  this.t = t(this.JSON);

  this.permissions = this.JSON.permissions;
  this.userFlags = this.JSON.userFlags;
  this.punishmentAction = this.JSON.punishmentAction;
  this.punishmentDeleteMessageSeconds = this.JSON.punishmentDeleteMessageSeconds;
  this.contextCommands = this.JSON.contextCommands;
  this.linkedid = this.JSON.linkedid;
  this.multiplier = this.JSON.multiplier;
  this.holdhands = this.JSON.holdhands;
  this.punishments = this.JSON.punishments;
  this.punishmentDuration = this.JSON.punishmentDuration;
  this.shoptypes = this.JSON.shoptypes;
  this.answertypes = this.JSON.answertypes;
  this.commandTypes = this.JSON.commandTypes;
  this.languages = this.JSON.languages;
  this.features = this.JSON.features;
  this.deleteReasons = this.JSON.deleteReasons;
  this.regions = this.JSON.regions;
  this.rolemodes = this.JSON.rolemodes;
  this.scopes = this.JSON.scopes;
  this.errors = this.JSON.errors;
  this.lvlupmodes = this.JSON.lvlupmodes;

  this.leveling = leveling(this);
  this.time = time(this);
  this.languageFunction = languageFunction(this);
  this.events = events(this);
  this.channelTypes = channelTypes(this);
  this.verification = verification(this);
  this.expire = expire(this);
  this.slashCommands = slashCommands(this);
  this.nitro = nitro(this);
  this.mod = mod(this);
  this.censor = censor(this);
  this.antivirus = antivirus(this);
  this.autotypes = autotypes(this);
  this.channelRules = channelRules(this);
  this.defaultAutoArchiveDuration = defaultAutoArchiveDuration(this);
  this.defaultForumLayout = defaultForumLayout(this);
  this.defaultSortOrder = defaultSortOrder(this);
  this.auditLogAction = auditLogAction(this);
 }
}
