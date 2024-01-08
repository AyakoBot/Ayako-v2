import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 member.client.util.DataBase.stickyrolemembers
  .create({
   data: {
    userid: member.id,
    guildid: member.guild.id,
    roles: member.roles.cache.filter((r) => r.id !== member.guild.id).map((r) => r.id),
   },
  })
  .then();
};
