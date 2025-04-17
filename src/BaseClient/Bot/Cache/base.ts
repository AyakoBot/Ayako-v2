import type {
 APIApplicationCommand,
 APIApplicationCommandPermission,
 APIAutoModerationRule,
 APIBan,
 APIEmoji,
 APIGuild,
 APIGuildChannel,
 APIGuildIntegration,
 APIGuildMember,
 APIGuildScheduledEvent,
 APIInvite,
 APIMessage,
 APIReaction,
 APIRole,
 APISoundboardSound,
 APIStageInstance,
 APISticker,
 APIThreadChannel,
 APIThreadMember,
 APIUser,
 APIVoiceState,
 APIWebhook,
} from 'discord-api-types/v10';
import type Redis from 'ioredis';
import type { RAutomod } from './automod';
import type { RBan } from './ban';
import type { RChannel, RChannelTypes } from './channel';
import type { RCommand } from './command';
import type { RCommandPermission } from './commandPermission';
import type { REmoji } from './emoji';
import type { REvent } from './event';
import type { RGuild } from './guild';
import type { RGuildCommand } from './guildCommand';
import type { RIntegration } from './integration';
import type { RInvite } from './invite';
import type { RMember } from './member';
import type { RMessage } from './message';
import type { RReaction } from './reaction';
import type { RRole } from './role';
import type { RSoundboardSound } from './soundboard';
import type { RStageInstance } from './stage';
import type { RSticker } from './sticker';
import type { RThread } from './thread';
import type { RThreadMember } from './threadMember';
import type { RUser } from './user';
import type { RVoiceState } from './voice';
import type { RWebhook } from './webhook';

type GuildBasedCommand<T extends boolean> = T extends true
 ? APIApplicationCommand & { guild_id: string }
 : APIApplicationCommand;

export type DeriveRFromAPI<T, K extends boolean> = T extends APIThreadChannel & {
 guild_id: string;
 member_id: string;
}
 ? RThread
 : T extends APIGuildIntegration & {
      user_id: string;
      guild_id: string;
     }
   ? RIntegration
   : T extends APIApplicationCommand
     ? K extends true
       ? RGuildCommand
       : RCommand
     : T extends APIUser
       ? RUser
       : T extends GuildBasedCommand<K>
         ? K extends true
           ? RGuildCommand
           : RCommand
         : T extends APIGuild
           ? RGuild
           : T extends APISoundboardSound
             ? RSoundboardSound
             : T extends APIGuildChannel<RChannelTypes>
               ? RChannel
               : T extends APISticker
                 ? RSticker
                 : T extends APIStageInstance
                   ? RStageInstance
                   : T extends APIRole
                     ? RRole
                     : T extends APIVoiceState
                       ? RVoiceState
                       : T extends APIAutoModerationRule
                         ? RAutomod
                         : T extends APIBan
                           ? RBan
                           : T extends APIInvite
                             ? RInvite
                             : T extends APIGuildMember
                               ? RMember
                               : T extends APIGuildScheduledEvent
                                 ? REvent
                                 : T extends APIWebhook
                                   ? RWebhook
                                   : T extends APIEmoji
                                     ? REmoji
                                     : T extends APIThreadChannel
                                       ? RThread
                                       : T extends APIApplicationCommandPermission
                                         ? RCommandPermission
                                         : T extends APIMessage
                                           ? RMessage
                                           : T extends APIGuildIntegration
                                             ? RIntegration
                                             : T extends APIReaction
                                               ? RReaction
                                               : T extends APIThreadMember
                                                 ? RThreadMember
                                                 : never;

export default abstract class Cache<
 T extends
  | APIUser
  | APIGuild
  | APISoundboardSound
  | GuildBasedCommand<K>
  | APISticker
  | APIStageInstance
  | APIRole
  | APIVoiceState
  | APIAutoModerationRule
  | APIBan
  | APIInvite
  | APIGuildMember
  | APIGuildScheduledEvent
  | APIEmoji
  | APIGuildChannel<RChannelTypes>
  | APIThreadChannel
  | APIApplicationCommandPermission
  | APIMessage
  | APIWebhook
  | APIGuildIntegration
  | APIReaction
  | APIThreadMember,
 K extends boolean = false,
> {
 abstract keys: ReadonlyArray<keyof DeriveRFromAPI<T, K>>;

 private prefix: string;
 private keystorePrefix: string;
 public redis: Redis;

 constructor(redis: Redis, type: string) {
  this.prefix = `cache:${type}`;
  this.keystorePrefix = `keystore:${type}`;
  this.redis = redis;
 }

 stringToData = (data: string | null) => (data ? (JSON.parse(data) as DeriveRFromAPI<T, K>) : null);

 keystore(...ids: string[]) {
  return `${this.keystorePrefix}${ids.length ? `:${ids.join(':')}` : ''}`;
 }

 key(...ids: string[]) {
  return `${this.prefix}${ids.length ? `:${ids.join(':')}` : ''}`;
 }

 abstract set(...args: [T, string, string, string]): Promise<boolean>;

 get(...ids: string[]): Promise<null | DeriveRFromAPI<T, K>> {
  return this.redis.get(this.key(...ids)).then((data) => this.stringToData(data));
 }

 del(...ids: string[]) {
  const pipeline = this.redis.pipeline();
  pipeline.del(this.key(...ids));
  pipeline.hdel(this.keystore(...ids), this.key(...ids));

  return pipeline.exec();
 }

 abstract apiToR(...args: [T, string, string, string]): DeriveRFromAPI<T, K> | false;
}
