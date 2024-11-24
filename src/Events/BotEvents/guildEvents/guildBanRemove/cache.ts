import { StoredPunishmentTypes } from '@prisma/client';
import * as Discord from 'discord.js';

export default async (ban: Discord.GuildBan) => {
 ban.client.util.cache.bans.delete(ban.user.id, ban.guild.id);

 await ban.client.util.DataBase.punishments
  .updateMany({
   where: {
    guildid: ban.guild.id,
    userid: ban.user.id,
    reason: ban.reason,
    type: StoredPunishmentTypes.tempban,
   },
   data: { type: StoredPunishmentTypes.ban },
  })
  .then();
};
