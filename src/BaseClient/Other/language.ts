import * as Discord from 'discord.js';
import merge from 'lodash.merge';
import client from '../Bot/Client.js';
import stp from '../UtilModules/stp.js';

export const getLangs = () => ({
 'en-GB': client.util.importCache.Language.languages.enJSON.file.default,
 'en-US': client.util.importCache.Language.languages.enJSON.file.default,
 'de-DE': client.util.importCache.Language.languages.deJSON.file.default,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mergeLang = <T extends Record<string, any>>(lang: T) =>
 merge({}, getLangs()['en-GB'], lang) as T & ReturnType<typeof getLangs>['en-GB'];

const t = (lan: ReturnType<typeof mergeLang>) => ({
 ...lan.t,
 welcome: (user: Discord.User, guild: Discord.Guild) => stp(lan.t.welcome, { user, guild }),
 defaultValuesLog: (oldValue: string, newValue: string) =>
  stp(lan.t.welcome, { oldValue, newValue }),
 pageBetween: (x: number, y: number) => stp(lan.t.pageBetween, { x, y }),
 voiceHub: (u: Discord.User) => stp(lan.t.voiceHub, { u }),
});

export default class Language {
 client = client;
 botName = client.user?.username ?? 'Ayako';
 botId = client.user?.id;
 CURRENT_LANGUAGE: keyof ReturnType<typeof getLangs> = 'en-GB';
 JSON: ReturnType<typeof getLangs>['en-GB'] = mergeLang(getLangs()['en-GB']);
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
 weekendstype: typeof this.JSON.weekendstype;

 leveling: ReturnType<typeof client.util.importCache.Language.t.leveling.file.default>;
 time: ReturnType<typeof client.util.importCache.Language.t.time.file.default>;
 languageFunction: ReturnType<
  typeof client.util.importCache.Language.t.languageFunction.file.default
 >;
 events: ReturnType<typeof client.util.importCache.Language.t.events.file.default>;
 channelTypes: ReturnType<typeof client.util.importCache.Language.t.channelTypes.file.default>;
 verification: ReturnType<typeof client.util.importCache.Language.t.verification.file.default>;
 expire: ReturnType<typeof client.util.importCache.Language.t.expire.file.default>;
 slashCommands: ReturnType<typeof client.util.importCache.Language.t.slashCommands.file.default>;
 nitro: ReturnType<typeof client.util.importCache.Language.t.nitro.file.default>;
 mod: ReturnType<typeof client.util.importCache.Language.t.mod.file.default>;
 censor: ReturnType<typeof client.util.importCache.Language.t.censor.file.default>;
 antivirus: ReturnType<typeof client.util.importCache.Language.t.antivirus.file.default>;
 autotypes: ReturnType<typeof client.util.importCache.Language.t.autotypes.file.default>;
 channelRules: ReturnType<typeof client.util.importCache.Language.t.channelRules.file.default>;
 defaultAutoArchiveDuration: ReturnType<
  typeof client.util.importCache.Language.t.defaultAutoArchiveDuration.file.default
 >;
 defaultForumLayout: ReturnType<
  typeof client.util.importCache.Language.t.defaultForumLayout.file.default
 >;
 defaultSortOrder: ReturnType<
  typeof client.util.importCache.Language.t.defaultSortOrder.file.default
 >;
 auditLogAction: { [key in Discord.GuildAuditLogsEntry['action']]: string };

 constructor(type: keyof ReturnType<typeof getLangs>) {
  this.client = client;
  this.CURRENT_LANGUAGE = type;

  this.JSON = mergeLang(getLangs()[this.CURRENT_LANGUAGE]);
  if (!this.JSON) this.JSON = mergeLang(getLangs()['en-GB']);

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
  this.weekendstype = this.JSON.weekendstype;

  this.leveling = client.util.importCache.Language.t.leveling.file.default(this);
  this.time = client.util.importCache.Language.t.time.file.default(this);
  this.languageFunction = client.util.importCache.Language.t.languageFunction.file.default(this);
  this.events = client.util.importCache.Language.t.events.file.default(this);
  this.channelTypes = client.util.importCache.Language.t.channelTypes.file.default(this);
  this.verification = client.util.importCache.Language.t.verification.file.default(this);
  this.expire = client.util.importCache.Language.t.expire.file.default(this);
  this.slashCommands = client.util.importCache.Language.t.slashCommands.file.default(this);
  this.nitro = client.util.importCache.Language.t.nitro.file.default(this);
  this.mod = client.util.importCache.Language.t.mod.file.default(this);
  this.censor = client.util.importCache.Language.t.censor.file.default(this);
  this.antivirus = client.util.importCache.Language.t.antivirus.file.default(this);
  this.autotypes = client.util.importCache.Language.t.autotypes.file.default(this);
  this.channelRules = client.util.importCache.Language.t.channelRules.file.default(this);
  this.defaultAutoArchiveDuration =
   client.util.importCache.Language.t.defaultAutoArchiveDuration.file.default(this);
  this.defaultForumLayout =
   client.util.importCache.Language.t.defaultForumLayout.file.default(this);
  this.defaultSortOrder = client.util.importCache.Language.t.defaultSortOrder.file.default(this);
  this.auditLogAction = client.util.importCache.Language.t.auditLogAction.file.default(this);
 }
}
