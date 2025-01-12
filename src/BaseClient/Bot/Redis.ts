import Redis from 'ioredis';

import AutomodCache from './Cache/automod.js';
import BanCache from './Cache/ban.js';
import ChannelCache from './Cache/channel.js';
import CommandCache from './Cache/command.js';
import CommandPermissionCache from './Cache/commandPermission.js';
import EmojiCache from './Cache/emoji.js';
import EventCache from './Cache/event.js';
import GuildCache from './Cache/guild.js';
import GuildCommandCache from './Cache/guildCommand.js';
import IntegrationCache from './Cache/integration.js';
import InviteCache from './Cache/invite.js';
import MemberCache from './Cache/member.js';
import MessageCache from './Cache/message.js';
import ReactionCache from './Cache/reaction.js';
import RoleCache from './Cache/role.js';
import SoundboardCache from './Cache/soundboard.js';
import StageCache from './Cache/stage.js';
import StickerCache from './Cache/sticker.js';
import ThreadCache from './Cache/thread.js';
import ThreadMemberCache from './Cache/threadMember.js';
import UserCache from './Cache/user.js';
import VoiceCache from './Cache/voice.js';
import WebhookCache from './Cache/webhook.js';

const redis = new Redis({ host: 'redis' });

export default redis;

export const prefix = `${process.env.mainId}:cache:${process.argv.includes('--dev') ? 'dev' : 'prod'}`;
await redis.keys(`${prefix}:*`).then((r) => (r.length ? redis.del(r) : 0));

export const cache = {
 automods: new AutomodCache(prefix, redis),
 bans: new BanCache(prefix, redis),
 channels: new ChannelCache(prefix, redis),
 commands: new CommandCache(prefix, redis),
 commandPermissions: new CommandPermissionCache(prefix, redis),
 emojis: new EmojiCache(prefix, redis),
 events: new EventCache(prefix, redis),
 guilds: new GuildCache(prefix, redis),
 guildCommands: new GuildCommandCache(prefix, redis),
 integrations: new IntegrationCache(prefix, redis),
 invites: new InviteCache(prefix, redis),
 members: new MemberCache(prefix, redis),
 messages: new MessageCache(prefix, redis),
 reactions: new ReactionCache(prefix, redis),
 roles: new RoleCache(prefix, redis),
 soundboards: new SoundboardCache(prefix, redis),
 stages: new StageCache(prefix, redis),
 stickers: new StickerCache(prefix, redis),
 threads: new ThreadCache(prefix, redis),
 threadMembers: new ThreadMemberCache(prefix, redis),
 users: new UserCache(prefix, redis),
 voices: new VoiceCache(prefix, redis),
 webhooks: new WebhookCache(prefix, redis),
};
