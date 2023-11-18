import * as Discord from 'discord.js';
import client from '../Client.js';
import enJSON from '../../Languages/en.json' assert { type: 'json' };
import stp from '../ClientHelperModules/stp.js';
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

export default class Language {
 botName = client.user?.username ?? 'Ayako';
 botId = client.user?.id;
 CURRENT_LANGUAGE: string = 'en';
 JSON: typeof enJSON = enJSON;
 stp = stp;

 t = {
  ...this.JSON,
  welcome: (user: Discord.User, guild: Discord.Guild) =>
   this.stp(this.JSON.welcome, { user, guild }),
  defaultValuesLog: (oldValue: string, newValue: string) =>
   this.stp(this.JSON.welcome, { oldValue, newValue }),
  pageBetween: (x: number, y: number) => this.stp(this.JSON.pageBetween, { x, y }),
  voiceHub: (u: Discord.User) => this.stp(this.JSON.voiceHub, { u }),
 };

 leveling = leveling(this);
 time = time(this);
 languageFunction = languageFunction(this);
 events = events(this);
 channelTypes = channelTypes(this);
 verification = verification(this);
 expire = expire(this);
 slashCommands = slashCommands(this);
 nitro = nitro(this);
 mod = mod(this);
 censor = censor(this);
 antivirus = antivirus(this);
 autotypes = autotypes(this);
 channelRules = channelRules(this);
 defaultAutoArchiveDuration = defaultAutoArchiveDuration(this);
 defaultForumLayout = defaultForumLayout(this);
 defaultSortOrder = defaultSortOrder(this);
 auditLogAction: { [key in Discord.GuildAuditLogsEntry['action']]: string } = auditLogAction(this);

 constructor(type: string | 'en') {
  this.CURRENT_LANGUAGE = type;
 }

 public async init() {
  this.JSON = (
   await import(`../../Languages/${this.CURRENT_LANGUAGE}.json`, {
    assert: { type: 'json' },
   })
  ).default;
 }
}

// 'appeal-questions': {
//  name: 'Appeal Questions',
//  fields: {
//   // TODO
//   yes: {
//    name: 'to',
//    desc: 'do',
//   },
//  },
// },
// appealsettings: {
//  name: 'Appeals',
//  fields: {
//   // TODO
//   yes: {
//    name: 'to',
//    desc: 'do',
//   },
//  },
// },
