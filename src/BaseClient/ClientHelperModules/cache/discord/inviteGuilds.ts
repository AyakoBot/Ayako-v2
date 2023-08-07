import * as Discord from 'discord.js';

export interface InviteGuilds {
 get: (guildId: string) => Discord.InviteGuild | undefined;
 set: (guildId: string, inviteGuild: Discord.InviteGuild) => void;
 delete: (guildId: string) => void;
 cache: Map<string, Discord.InviteGuild>;
}

const self: InviteGuilds = {
 get: (id) => self.cache.get(id),
 set: (id, guild) => self.cache.set(id, guild),
 delete: (id) => {
  self.cache.delete(id);
 },
 cache: new Map(),
};

export default self;
