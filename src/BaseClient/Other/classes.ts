import * as Discord from 'discord.js';
import * as RawData from 'discord.js/typings/rawDataTypes.js';

export default undefined;

// @ts-ignore
export class GuildBan extends Discord.GuildBan {
 constructor(client: Discord.Client<true>, data: RawData.RawGuildBanData, guild: Discord.Guild) {
  super(client, data, guild);
 }
}

// @ts-ignore
export class Invite extends Discord.Invite {
 constructor(client: Discord.Client<true>, data: RawData.RawInviteData) {
  super(client, data);
 }
}

// @ts-ignore
export class GuildMember extends Discord.GuildMember {
 constructor(
  client: Discord.Client<true>,
  data:
   | Discord.APIGuildMember
   | Discord.APIInteractionGuildMember
   | Discord.APIInteractionDataResolvedGuildMember
   | Discord.GatewayGuildMemberAddDispatchData
   | Discord.GatewayGuildMemberUpdateDispatchData
   | Required<Discord.RESTPatchAPICurrentGuildMemberNicknameJSONBody>
   | { user: { id: Discord.Snowflake } },
  guild: Discord.Guild,
 ) {
  super(client, data, guild);
 }
}

// @ts-ignore
export class Webhook extends Discord.Webhook {
 constructor(client: Discord.Client<true>, data: RawData.RawWebhookData) {
  super(client, data);
 }
}

// @ts-ignore
export class Message extends Discord.Message {
 constructor(client: Discord.Client<true>, data: RawData.RawMessageData) {
  super(client, data);
 }
}

// @ts-ignore
export class GuildAuditLogs extends Discord.GuildAuditLogs {
 constructor(guild: Discord.Guild, data: RawData.RawGuildAuditLogData) {
  super(guild, data);
 }
}

// @ts-ignore
export class Integration extends Discord.Integration {
 constructor(client: Discord.Client<true>, data: RawData.RawIntegrationData, guild: Discord.Guild) {
  super(client, data, guild);
 }
}

// @ts-ignore
export class GuildOnboarding extends Discord.GuildOnboarding {
 constructor(client: Discord.Client<true>, data: Discord.RESTGetAPIGuildOnboardingResult) {
  super(client, data);
 }
}

// @ts-ignore
export class WelcomeScreen extends Discord.WelcomeScreen {
 constructor(guild: Discord.Guild, data: RawData.RawWelcomeScreenData) {
  super(guild, data);
 }
}

// @ts-ignore
export class ThreadChannel extends Discord.ThreadChannel {
 constructor(guild: Discord.Guild, data: RawData.RawThreadChannelData) {
  super(guild, data);
 }
}

// @ts-ignore
export class AutoModerationRule extends Discord.AutoModerationRule {
 constructor(
  client: Discord.Client<true>,
  data: Discord.APIAutoModerationRule,
  guild: Discord.Guild,
 ) {
  super(client, data, guild);
 }
}
