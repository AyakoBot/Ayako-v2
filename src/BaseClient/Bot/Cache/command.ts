import type { APIApplicationCommand } from 'discord.js';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RCommand = Omit<APIApplicationCommand, 'guild_id'>;

export const RCommandKeys = [
 'id',
 'type',
 'application_id',
 'name',
 'name_localizations',
 'name_localized',
 'description',
 'description_localizations',
 'description_localized',
 'options',
 'default_member_permissions',
 'dm_permission',
 'default_permission',
 'nsfw',
 'integration_types',
 'contexts',
 'version',
 'handler',
] as const;

export default class CommandCache extends Cache<APIApplicationCommand> {
 public keys = RCommandKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:commands`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIApplicationCommand) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${data.id}`, JSON.stringify(rData));

  return true;
 }

 get(id: string) {
  return this.redis.get(`${this.key()}:${id}`).then((data) => this.stringToData(data));
 }

 del(id: string): Promise<number> {
  return this.redis.del(`${this.key()}:${id}`);
 }

 apiToR(data: APIApplicationCommand) {
  if (!data.guild_id) return false;

  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  keysNotToCache.forEach((k) => delete data[k]);

  return structuredClone(data) as RCommand;
 }
}
