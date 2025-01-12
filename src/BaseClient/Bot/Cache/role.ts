import type { APIRole } from 'discord.js';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RRole = Omit<APIRole, 'icon'> & { icon_url: string | null; guild_id: string };

export const RRoleKeys = [
 'id',
 'name',
 'color',
 'hoist',
 'icon_url',
 'unicode_emoji',
 'position',
 'permissions',
 'managed',
 'mentionable',
 'tags',
 'flags',
 'guild_id',
] as const;

export default class RoleCache extends Cache<APIRole> {
 public keys = RRoleKeys;

 constructor(prefix: string, redis: Redis) {
  super(`${prefix}:roles`, redis);
 }

 public static iconUrl(icon: string, roleId: string) {
  return `https://cdn.discordapp.com/role-icons/${roleId}/${icon}.${icon.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 key() {
  return this.prefix;
 }

 async set(data: APIRole, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.redis.set(`${this.key()}:${rData.guild_id}:${data.id}`, JSON.stringify(rData));

  return true;
 }

 get(id: string) {
  return this.redis.get(`${this.key()}:${id}`).then((data) => this.stringToData(data));
 }

 del(id: string): Promise<number> {
  return this.redis
   .keys(`${this.key()}:${id}`)
   .then((keys) => (keys.length ? this.redis.del(keys) : 0));
 }

 apiToR(data: APIRole, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RRole;
  rData.guild_id = guildId;
  rData.icon_url = data.icon ? RoleCache.iconUrl(data.icon, guildId) : null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
