import * as Discord from 'discord.js';

/**
 * Returns an array of serialized permission objects for a given guild channel.
 * @param channel - The guild channel to get serialized permissions for.
 * @returns An array of serialized permission objects.
 */
export default (channel: Discord.GuildChannel) =>
 channel.permissionOverwrites.cache.map((o) => ({
  id: o.id,
  type: o.type,
  perms: new Discord.PermissionsBitField()
   .add(Discord.PermissionsBitField.All)
   .toArray()
   .map((p) => {
    const isDenied = o.deny.has(p, false);
    const isAllowed = o.allow.has(p, false);
    const isNeutral = !isDenied && !isAllowed;

    return { perm: p, denied: isDenied, neutral: isNeutral, allowed: isAllowed };
   }),
 }));
