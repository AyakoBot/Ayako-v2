import type { APIGuildIntegration } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';

export type RIntegration = Omit<APIGuildIntegration, 'user'> & {
 user_id: string | null;
 guild_id: string;
};

export const RIntegrationKeys = [
 'id',
 'name',
 'type',
 'enabled',
 'syncing',
 'role_id',
 'enable_emoticons',
 'expire_behavior',
 'expire_grace_period',
 'user_id',
 'account',
 'synced_at',
 'scopes',
 'guild_id',
] as const;

export default class IntegrationCache extends Cache<
 APIGuildIntegration & { user_id: string; guild_id: string }
> {
 public keys: ReadonlyArray<keyof RIntegration> = RIntegrationKeys;

 constructor(redis: Redis) {
  super(redis, 'integrations');
 }

 async set(data: APIGuildIntegration, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id]);
  return true;
 }

 apiToR(data: APIGuildIntegration, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key),
  );

  const rData = structuredClone(data) as unknown as RIntegration;
  rData.guild_id = guildId;
  rData.user_id = data.user?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
