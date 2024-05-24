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
export class Message extends Discord.Message<true> {
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

// @ts-ignore
export class GuildEmoji extends Discord.GuildEmoji {
 constructor(client: Discord.Client<true>, data: RawData.RawGuildEmojiData, guild: Discord.Guild) {
  super(client, data, guild);
 }
}

// @ts-ignore
export class Role extends Discord.Role {
 constructor(client: Discord.Client<true>, data: RawData.RawRoleData, guild: Discord.Guild) {
  super(client, data, guild);
 }
}

// @ts-ignore
export class GuildChannel extends Discord.GuildChannel {
 constructor(
  guild: Discord.Guild,
  channel: RawData.RawGuildChannelData,
  client: Discord.Client<true>,
 ) {
  super(guild, channel, client);
 }
}

// @ts-ignore
export class User extends Discord.User {
 constructor(client: Discord.Client<true>, data: RawData.RawUserData) {
  super(client, data);
 }
}

// @ts-ignore
export class Ban extends Discord.GuildBan {
 constructor(client: Discord.Client<true>, data: RawData.RawGuildBanData, guild: Discord.Guild) {
  super(client, data, guild);
 }
}

// @ts-ignore
export class ApplicationCommand extends Discord.ApplicationCommand {
 constructor(
  client: Discord.Client<true>,
  data: RawData.RawApplicationCommandData,
  guild?: Discord.Guild,
  guildId?: Discord.Snowflake,
 ) {
  super(client, data, guild, guildId);
 }
}

export const Channel = <T extends Discord.ChannelType>(
 client: Discord.Client,
 c: Discord.APIChannel | Discord.APIThreadChannel,
 guild: Discord.Guild | null | undefined,
): T extends 0
 ? Discord.TextChannel
 : T extends 1
   ? Discord.DMChannel
   : T extends 2
     ? Discord.BaseGuildVoiceChannel
     : T extends 4
       ? Discord.CategoryChannel
       : T extends 5
         ? Discord.NewsChannel
         : T extends 10
           ? Discord.ThreadChannel
           : T extends 11
             ? Discord.ThreadChannel
             : T extends 12
               ? Discord.ThreadChannel
               : T extends 13
                 ? Discord.StageChannel
                 : T extends 15
                   ? Discord.ForumChannel
                   : T extends 16
                     ? Discord.MediaChannel
                     : never => {
 switch (c.type) {
  case Discord.ChannelType.GuildText: {
   if (!guild) throw new Error('GuildText type requires Guild')
   // @ts-ignore
   return new Discord.TextChannel(guild, c, client);
  }
  case Discord.ChannelType.DM: {
   // @ts-ignore
   return new Discord.DMChannel(client, c);
  }
  case Discord.ChannelType.GuildVoice: {
   if (!guild) throw new Error('GuildVoice type requires Guild')
    // @ts-ignore
   return new Discord.VoiceChannel(guild, c, client);
  }
  case Discord.ChannelType.GuildCategory: {
   if (!guild) throw new Error('GuildCategory type requires Guild')
    // @ts-ignore
   return new Discord.CategoryChannel(guild, c, client);
  }
  case Discord.ChannelType.GuildAnnouncement: {
   if (!guild) throw new Error('GuildAnnouncement type requires Guild')
    // @ts-ignore
   return new Discord.NewsChannel(guild, c, client);
  }
  case Discord.ChannelType.AnnouncementThread:
  case Discord.ChannelType.PublicThread:
  case Discord.ChannelType.PrivateThread: {
   if (!guild) throw new Error('Thread type requires Guild')
    // @ts-ignore
   return new Discord.ThreadChannel(guild, c, client);
  }
  case Discord.ChannelType.GuildStageVoice: {
   if (!guild) throw new Error('GuildStageVoice type requires Guild')
    // @ts-ignore
   return new Discord.StageChannel(guild, c, client);
  }
  case Discord.ChannelType.GuildForum: {
   if (!guild) throw new Error('GuildForum type requires Guild')
    // @ts-ignore
   return new Discord.ForumChannel(guild, c, client);
  }
  default: {
   // @ts-ignore
   throw new Error(`Unknown Channel Type ${Discord.ChannelType[c.type]}`);
  }
 }
};

// @ts-ignore
export class GuildPreview extends Discord.GuildPreview {
 constructor(client: Discord.Client<true>, data: RawData.RawGuildPreviewData) {
  super(client, data);
 }
}

// @ts-ignore
export class Guild extends Discord.Guild {
 constructor(client: Discord.Client<true>, data: RawData.RawGuildData) {
  super(client, data);
 }
}

// @ts-ignore
export class VoiceRegion extends Discord.VoiceRegion {
 constructor(data: RawData.RawVoiceRegionData) {
  super(data);
 }
}

// @ts-ignore
export class Widget extends Discord.Widget {
 constructor(client: Discord.Client<true>, data: RawData.RawWidgetData) {
  super(client, data);
 }
}

// @ts-ignore
export class GuildScheduledEvent extends Discord.GuildScheduledEvent {
 constructor(client: Discord.Client<true>, data: RawData.RawGuildScheduledEventData) {
  super(client, data);
 }
}

// @ts-ignore
export class GuildTemplate extends Discord.GuildTemplate {
 constructor(client: Discord.Client<true>, data: RawData.RawGuildTemplateData) {
  super(client, data);
 }
}

// @ts-ignore
export class Sticker extends Discord.Sticker {
 constructor(client: Discord.Client<true>, data: RawData.RawStickerData) {
  super(client, data);
 }
}

// @ts-ignore
export class StageInstance extends Discord.StageInstance {
 constructor(
  client: Discord.Client<true>,
  data: RawData.RawStageInstanceData,
  channel: Discord.StageChannel,
 ) {
  super(client, data, channel);
 }
}

// @ts-ignore
export class ThreadMember extends Discord.ThreadMember {
 constructor(thread: Discord.ThreadChannel, data: RawData.RawThreadMemberData) {
  super(thread, data);
 }
}

export class ClientUser extends Discord.ClientUser {
 constructor(client: Discord.Client<true>, data: RawData.RawUserData) {
  super(client, data);
 }
}

export class ChatInputCommandInteraction extends Discord.ChatInputCommandInteraction {
 constructor(client: Discord.Client<true>, data: RawData.RawInteractionData) {
  super(client, data);
 }
}

export class UserContextMenuCommandInteraction extends Discord.UserContextMenuCommandInteraction {
 constructor(client: Discord.Client<true>, data: RawData.RawInteractionData) {
  super(client, data);
 }
}

// eslint-disable-next-line max-len
export class MessageContextMenuCommandInteraction extends Discord.MessageContextMenuCommandInteraction {
 constructor(client: Discord.Client<true>, data: RawData.RawInteractionData) {
  super(client, data);
 }
}

export class AutocompleteInteraction extends Discord.AutocompleteInteraction {
 constructor(client: Discord.Client<true>, data: RawData.RawInteractionData) {
  super(client, data);
 }
}

// @ts-ignore
export class ButtonInteraction extends Discord.ButtonInteraction {
 constructor(client: Discord.Client<true>, data: RawData.RawMessageButtonInteractionData) {
  super(client, data);
 }
}

// @ts-ignore
export class ChannelSelect extends Discord.ChannelSelectMenuInteraction {
 constructor(client: Discord.Client<true>, data: Discord.APIMessageChannelSelectInteractionData) {
  super(client, data);
 }
}

// @ts-ignore
export class MentionableSelect extends Discord.MentionableSelectMenuInteraction {
 constructor(
  client: Discord.Client<true>,
  data: Discord.APIMessageMentionableSelectInteractionData,
 ) {
  super(client, data);
 }
}

// @ts-ignore
export class RoleSelect extends Discord.RoleSelectMenuInteraction {
 constructor(client: Discord.Client<true>, data: Discord.APIMessageRoleSelectInteractionData) {
  super(client, data);
 }
}

// @ts-ignore
export class StringSelect extends Discord.StringSelectMenuInteraction {
 constructor(client: Discord.Client<true>, data: Discord.APIMessageStringSelectInteractionData) {
  super(client, data);
 }
}

// @ts-ignore
export class UserSelect extends Discord.UserSelectMenuInteraction {
 constructor(client: Discord.Client<true>, data: Discord.APIMessageUserSelectInteractionData) {
  super(client, data);
 }
}

// @ts-ignore
export class ModalSubmit extends Discord.ModalSubmitInteraction {
 constructor(client: Discord.Client<true>, data: Discord.APIModalSubmitInteraction) {
  super(client, data);
 }
}

// @ts-ignore
export class MessageReaction extends Discord.MessageReaction {
 constructor(
  client: Discord.Client<true>,
  data: RawData.RawMessageReactionData,
  message: Discord.Message<true>,
 ) {
  super(client, data, message);
 }
}
