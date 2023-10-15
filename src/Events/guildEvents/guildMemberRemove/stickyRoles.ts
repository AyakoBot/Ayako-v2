import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (member: Discord.GuildMember) => {
 ch.DataBase.stickyrolemembers
  .create({
   data: {
    userid: member.id,
    guildid: member.guild.id,
    roles: member.roles.cache.filter((r) => r.id !== member.guild.id).map((r) => r.id),
   },
  })
  .then();
};
