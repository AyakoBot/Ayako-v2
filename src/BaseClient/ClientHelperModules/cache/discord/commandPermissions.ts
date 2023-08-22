import * as Discord from 'discord.js';
import DataBase from '../../../DataBase.js';
import getBotIdFromToken from '../../getBotIdFromToken.js';

export interface CommandPermissions {
 get: (
  guild: Discord.Guild,
  commandId: string,
 ) => Promise<Discord.ApplicationCommandPermissions[] | undefined>;
 set: (
  guildId: string,
  commandId: string,
  permissions: Discord.ApplicationCommandPermissions[],
 ) => void;
 delete: (guildId: string, commandId: string) => void;
 cache: Map<string, Map<string, Discord.ApplicationCommandPermissions[]>>;
}

const self: CommandPermissions = {
 get: async (guild, commandId) => {
  const cached = self.cache.get(guild.id)?.get(commandId);
  if (cached) return cached;

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const guildSettings = await DataBase.guildsettings.findUnique({
   where: { guildid: guild.id, token: { not: null } },
  });
  const fetched = await requestHandler.commands.getGuildCommandsPermissions(
   guild,
   guildSettings?.token ? getBotIdFromToken(guildSettings.token) : guild.client.user.id,
  );

  self.cache.get(guild.id)?.clear();
  fetched?.map((f) =>
   self.set(
    guild.id,
    f.id,
    f.permissions.map((p) => ({ id: p.id, type: p.type, permission: p.permission })),
   ),
  );

  return self.cache.get(guild.id)?.get(commandId);
 },
 set: (guildId, commandId, permissions) => {
  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(commandId, permissions);
 },
 delete: (guildId, commandId) => {
  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(commandId);
 },
 cache: new Map(),
};

export default self;
