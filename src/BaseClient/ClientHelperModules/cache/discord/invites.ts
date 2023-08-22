import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

export interface Invites {
 get: (code: string, channelId: string, guild: Discord.Guild) => Promise<number | undefined>;
 set: (invite: Discord.Invite, guildId: string) => void;
 find: (code: string) => number | undefined;
 delete: (code: string, guildId: string, channelId: string) => void;
 cache: Map<string, Map<string, Map<string, number>>>;
}

const self: Invites = {
 get: async (code, channelId, guild) => {
  const cached = self.cache.get(guild.id)?.get(channelId)?.get(code);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getInvites(guild);
  if ('message' in fetched) {
   error(guild, new Error('Couldnt get Invites'));
   return undefined;
  }

  fetched?.forEach((f) => {
   self.set(new Classes.Invite(guild.client, f), guild.id);
  });

  self.cache.get(guild.id)?.clear();

  return Number(fetched?.find((f) => f.code === code));
 },
 set: (invite, guildId) => {
  if (!invite.channelId) {
   // eslint-disable-next-line no-console
   console.error('Invite without channel ID found!', invite);
   return;
  }

  if (!self.cache.get(guildId)) {
   self.cache.set(guildId, new Map());
  }

  if (!self.cache.get(guildId)?.get(invite.channelId)) {
   self.cache.get(guildId)?.set(invite.channelId, new Map());
  }

  self.cache.get(guildId)?.get(invite.channelId)?.set(invite.code, Number(invite.uses));
 },
 find: (code) =>
  Array.from(self.cache, ([, g]) => g)
   .map((c) => Array.from(c, ([, i]) => i))
   .flat()
   .find((c) => c.get(code))
   ?.get(code),
 delete: (code, guildId, channelId) => {
  const cached = self.find(code);
  if (!cached || !channelId) return;

  if (self.cache.get(guildId)?.size === 1) {
   if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
    self.cache.get(guildId)?.get(channelId)?.clear();
   } else {
    self.cache.get(guildId)?.get(channelId)?.delete(code);
   }
  } else if (self.cache.get(guildId)?.get(channelId)?.size === 1) {
   self.cache.get(guildId)?.delete(channelId);
  } else {
   self.cache.get(guildId)?.get(channelId)?.delete(code);
  }
 },
 cache: new Map(),
};

export default self;
