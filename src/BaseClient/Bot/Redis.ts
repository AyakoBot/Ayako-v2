import Redis from 'ioredis';
import { glob } from 'glob';

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

export const prefix = 'cache';
const cacheDBnum = process.argv.includes('--dev') ? 2 : 0;
const scheduleDBnum = process.argv.includes('--dev') ? 2 : 1;

export const cacheDB = new Redis({ host: 'redis', db: cacheDBnum });
export const cacheSub = new Redis({ host: 'redis', db: cacheDBnum });
export const scheduleDB = new Redis({ host: 'redis', db: scheduleDBnum });
export const scheduleSub = new Redis({ host: 'redis', db: scheduleDBnum });

export default cacheDB;

await cacheDB.config('SET', 'notify-keyspace-events', 'Ex');
await scheduleDB.config('SET', 'notify-keyspace-events', 'Ex');

await cacheSub.subscribe(`__keyevent@${cacheDBnum}__:expired`);
await scheduleSub.subscribe(`__keyevent@${scheduleDBnum}__:expired`);

export const cache = {
 automods: new AutomodCache(cacheDB),
 bans: new BanCache(cacheDB),
 channels: new ChannelCache(cacheDB),
 commands: new CommandCache(cacheDB),
 commandPermissions: new CommandPermissionCache(cacheDB),
 emojis: new EmojiCache(cacheDB),
 events: new EventCache(cacheDB),
 guilds: new GuildCache(cacheDB),
 guildCommands: new GuildCommandCache(cacheDB),
 integrations: new IntegrationCache(cacheDB),
 invites: new InviteCache(cacheDB),
 members: new MemberCache(cacheDB),
 messages: new MessageCache(cacheDB),
 reactions: new ReactionCache(cacheDB),
 roles: new RoleCache(cacheDB),
 soundboards: new SoundboardCache(cacheDB),
 stages: new StageCache(cacheDB),
 stickers: new StickerCache(cacheDB),
 threads: new ThreadCache(cacheDB),
 threadMembers: new ThreadMemberCache(cacheDB),
 users: new UserCache(cacheDB),
 voices: new VoiceCache(cacheDB),
 webhooks: new WebhookCache(cacheDB),
};

const callback = async (channel: string, key: string) => {
 if (
  channel !== `__keyevent@${cacheDBnum}__:expired` &&
  channel !== `__keyevent@${scheduleDBnum}__:expired`
 ) {
  return;
 }

 if (key.includes('scheduled-data:')) return;

 const keyArgs = key.split(/:/g).splice(0, 2);
 const path = keyArgs.filter((k) => Number.isNaN(+k)).join('/');

 const dataKey = key.replace('scheduled:', 'scheduled-data:');
 const dbNum = channel.split('@')[1].split(':')[0];
 const db = dbNum === String(cacheDBnum) ? cacheDB : scheduleDB;

 const value = await db.get(dataKey);
 db.expire(dataKey, 10);

 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Events/RedisEvents/scheduled/**/*`,
 );

 const file = files.find((f) => f.endsWith(`${path}.js`));
 if (!file) return;

 (await import(file)).default(value ? JSON.parse(value) : undefined);
};

cacheSub.on('message', callback);
scheduleSub.on('message', callback);
