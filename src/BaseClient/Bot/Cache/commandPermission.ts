import type { APIApplicationCommandPermission } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RCommandPermission = APIApplicationCommandPermission & { guild_id: string };

export const RCommandPermissionKeys = ['id', 'type', 'permission', 'guild_id'] as const;

export default class CommandPermissionCache extends Cache<APIApplicationCommandPermission> {
 public keys = RCommandPermissionKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:commandPermissions`, redis);
 }

 key() {
  return this.prefix;
 }

 async set(data: APIApplicationCommandPermission, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${rData.guild_id}:${data.id}`, JSON.stringify(rData));

  return true;
 }

 get(id: string) {
  return this.redis.get(`${this.key()}:${id}`).then((data) => this.stringToData(data));
 }

 async del(id: string): Promise<number> {
  const keys = await Cache.scanKeys(`${this.key()}:${id}`);
  return keys.length ? this.redis.del(keys) : 0;
 }

 apiToR(data: APIApplicationCommandPermission, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RCommandPermission;
  rData.guild_id = guildId;

  keysNotToCache.forEach((k) => delete (rData as unknown as Record<string, unknown>)[k as string]);

  return structuredClone(rData);
 }
}
