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

 unknown = this.JSON.unknown;
 Unknown = this.JSON.Unknown;
 None = this.JSON.None;
 linkedid = this.JSON.linkedid;
 multiplier = this.JSON.multiplier;
 punishmentDuration = this.JSON.punishmentDuration;
 punishmentAction = this.JSON.punishmentAction;
 punishmentDeleteMessageSeconds = this.JSON.punishmentDeleteMessageSeconds;
 systemChannelFlags = this.JSON.systemChannelFlags;
 commands = this.JSON.commands;
 contextCommands = this.JSON.contextCommands;
 userFlags = this.JSON.userFlags;
 errors = this.JSON.errors;
 features = this.JSON.features;
 permissions = this.JSON.permissions;
 punishments = this.JSON.punishments;
 shoptypes = this.JSON.shoptypes;
 commandTypes = this.JSON.commandTypes;
 languages = this.JSON.languages;
 deleteReasons = this.JSON.deleteReasons;
 regions = this.JSON.regions;
 welcome = (user: Discord.User, guild: Discord.Guild) =>
  this.stp(this.JSON.welcome, { user, guild });
 scopes = this.JSON.scopes;
 rolemodes = this.JSON.rolemodes;
 defaultValuesLog = (oldValue: string, newValue: string) =>
  this.stp(this.JSON.welcome, { oldValue, newValue });
 featuresName = this.JSON.featuresName;
 regionsName = this.JSON.regionsName;
 defaultAutoArchiveDurationName = this.JSON.defaultAutoArchiveDurationName;
 defaultForumLayoutName = this.JSON.defaultForumLayoutName;
 defaultSortOrderName = this.JSON.defaultSortOrderName;
 Scopes = this.JSON.Scopes;
 Result = this.JSON.Result;
 stagePrivacyLevels = this.JSON.stagePrivacyLevels;
 none = this.JSON.none;
 reason = this.JSON.reason;
 No = this.JSON.No;
 Yes = this.JSON.Yes;
 duration = this.JSON.duration;
 attention = this.JSON.attention;
 Embeds = this.JSON.Embeds;
 error = this.JSON.error;
 content = this.JSON.content;
 name = this.JSON.name;
 optional = this.JSON.optional;
 required = this.JSON.required;
 small = this.JSON.small;
 joinedAt = this.JSON.joinedAt;
 createdAt = this.JSON.createdAt;
 roles = this.JSON.roles;
 large = this.JSON.large;
 loading = this.JSON.loading;
 Enabled = this.JSON.Enabled;
 Disabled = this.JSON.Disabled;
 Number = this.JSON.Number;
 Punishment = this.JSON.Punishment;
 noReasonProvided = this.JSON.noReasonProvided;
 Aborted = this.JSON.Aborted;
 Description = this.JSON.Description;
 Command = this.JSON.Command;
 Type = this.JSON.Type;
 noAliases = this.JSON.noAliases;
 Default = this.JSON.Default;
 Level = this.JSON.Level;
 End = this.JSON.End;
 Message = this.JSON.Message;
 Added = this.JSON.Added;
 Removed = this.JSON.Removed;
 Changed = this.JSON.Changed;
 Member = this.JSON.Member;
 Members = this.JSON.Members;
 Role = this.JSON.Role;
 Roles = this.JSON.Roles;
 Tier = this.JSON.Tier;
 Channel = this.JSON.Channel;
 Emoji = this.JSON.Emoji;
 User = this.JSON.User;
 Users = this.JSON.Users;
 Application = this.JSON.Application;
 Bot = this.JSON.Bot;
 Flags = this.JSON.Flags;
 ScheduledEvent = this.JSON.ScheduledEvent;
 Webhook = this.JSON.Webhook;
 color = this.JSON.color;
 ChannelRules = this.JSON.ChannelRules;
 Channels = this.JSON.Channels;
 Current = this.JSON.Current;
 Mentionables = this.JSON.Mentionables;
 Mentionable = this.JSON.Mentionable;
 Done = this.JSON.Done;
 Create = this.JSON.Create;
 Detect = this.JSON.Detect;
 Refresh = this.JSON.Refresh;
 Delete = this.JSON.Delete;
 Examples = this.JSON.Examples;
 Redacted = this.JSON.Redacted;
 Threads = this.JSON.Threads;
 Topic = this.JSON.Topic;
 Servers = this.JSON.Servers;
 Commands = this.JSON.Commands;
 login = this.JSON.login;
 and = this.JSON.and;
 Never = this.JSON.Never;
 Join = this.JSON.Join;
 Server = this.JSON.Server;
 Deprecated = this.JSON.Deprecated;
 Overrides = this.JSON.Overrides;
 Triggers = this.JSON.Triggers;
 Empty = this.JSON.Empty;
 Label = this.JSON.Label;
 Add = this.JSON.Add;
 Edit = this.JSON.Edit;
 Before = this.JSON.Before;
 After = this.JSON.After;
 Extra = this.JSON.Extra;
 InviteCustomBot = this.JSON.InviteCustomBot;
 Invite = this.JSON.Invite;
 Other = this.JSON.Other;
 Page = this.JSON.Page;
 pageBetween = (x: number, y: number) => this.stp(this.JSON.pageBetween, { x, y });
 voiceHub = (u: Discord.User) => this.stp(this.JSON.voiceHub, { u });

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
