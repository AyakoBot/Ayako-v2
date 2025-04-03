import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async () => client.guilds.cache.forEach((g) => run(g));

export const run = async (guild: Discord.Guild) => {
 const settings = await client.util.DataBase.nitrosettings.findUnique({
  where: { guildid: guild.id, active: true },
 });
 if (!settings) return;

 const users = await client.util.DataBase.nitrousers.findMany({ where: { guildid: guild.id } });
 if (!users.length) return;

 const roles = await client.util.DataBase.nitroroles.findMany({
  where: { guildid: guild.id, days: { not: 0 } },
 });
 if (!roles.length) return;

 const language = await client.util.getLanguage(guild.id);

 [...new Set(users.filter((u) => u.userid).map((u) => u.userid))].forEach(async (u) => {
  const member = await guild.client.util.request.guilds.getMember(guild, u);
  if ('message' in member) {
   await client.util.DataBase.nitrousers.updateMany({
    where: { boostend: null, userid: u, guildid: guild.id },
    data: { boostend: Date.now() },
   });
   return;
  }

  const days = users
   .filter((us) => Number(us.userid) === Number(u))
   .map((user) => getDaysDifference(Number(user.booststart), Number(user.boostend) || Date.now()))
   .reduce((a, b) => a + b, 0);

  const rolesToGive = roles.filter((r) => Number(r.days) <= days);
  const closestRolesToGive = rolesToGive.sort((a, b) => Number(a.days) - Number(b.days)).at(-1);
  const rolesToRemove = roles.filter((r) => Number(r.days) > days);

  if (
   closestRolesToGive?.roles.some((role) => member.roles.cache.has(role)) &&
   !rolesToRemove.filter((r) => r.roles.every((role) => member.roles.cache.has(role))).length
  ) {
   return;
  }

  if (settings.rolemode) {
   log(rolesToGive.map((r) => r.roles).flat(), member, settings.logchannels, language, days, true);

   client.util.roleManager.add(
    member,
    rolesToGive.map((r) => r.roles).flat(),
    language.autotypes.nitro,
    1,
   );
  }

  if (!settings.rolemode) {
   const filteredRoles = rolesToRemove
    .map((r) => r.roles)
    .flat()
    .filter((r) => !closestRolesToGive?.roles.includes(r));

   log(closestRolesToGive?.roles ?? [], member, settings.logchannels, language, days, false);

   client.util.roleManager.add(
    member,
    closestRolesToGive?.roles ?? [],
    language.autotypes.nitro,
    1,
   );
   client.util.roleManager.remove(member, filteredRoles, language.autotypes.nitro, 1);
  }
 });
};

const getDaysDifference = (start: number, end: number) =>
 Math.ceil(Math.abs(start - end) / (1000 * 3600 * 24));

const log = async (
 roles: string[],
 member: Discord.GuildMember,
 logs: string[],
 language: CT.Language,
 days: number,
 stack: boolean,
) => {
 if (!logs.length) return;
 if (!roles.length) return;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: client.util.constants.events.logs.guild.MemberUpdate,
   name: language.events.logs.guild.memberUpdate,
  },
  description: stack
   ? language.events.ready.nitro.stackRoles(
      member.user,
      roles.map((r) => member.guild.roles.cache.get(r)).filter((r): r is Discord.Role => !!r),
      days,
     )
   : language.events.ready.nitro.replaceRoles(
      member.user,
      roles.map((r) => member.guild.roles.cache.get(r)).filter((r): r is Discord.Role => !!r),
      days,
     ),
  color: client.util.getColor(await client.util.getBotMemberFromGuild(member.guild)),
 };

 client.util.send({ id: logs, guildId: member.guild.id }, { embeds: [embed] }, 10000);
};
