import type { APIApplicationCommand } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import type { MakeRequired } from 'src/Typings/Typings';
import Cache from './base.js';

export type RGuildCommand = MakeRequired<APIApplicationCommand, 'guild_id'>;

export const RGuildCommandKeys = [
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
 'guild_id',
] as const;

export default class GuildCommandCache extends Cache<
 APIApplicationCommand & { guild_id: string },
 true
> {
 public keys = RGuildCommandKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:commands`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIApplicationCommand & { guild_id: string }) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${data.guild_id}:${data.id}`, JSON.stringify(rData));

  return true;
 }

 get(gId: string, id: string) {
  return this.redis.get(`${this.key()}:${gId}:${id}`).then((data) => this.stringToData(data));
 }

 async del(id: string): Promise<number> {
  const keys = await Cache.scanKeys(`${this.key()}:${id}`);
  return keys.length ? this.redis.del(keys) : 0;
 }

 // eslint-disable-next-line class-methods-use-this
 apiToR(data: APIApplicationCommand & { guild_id: string }) {
  if (!data.guild_id) return false;
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );
  keysNotToCache.forEach((k) => delete data[k]);

  return structuredClone(data) as unknown as RGuildCommand;
 }
}
