import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

// TODO

export default async (_: Discord.GuildMember, member: Discord.GuildMember) => {
 if (member.guild.id !== '298954459172700181') return;
 if (member.pending) return;

 if (member.user.avatarURL()?.startsWith('a_')) {
  end(member);
  return;
 }

 if (member.user.banner) {
  end(member);
  return;
 }

 if (!member.kickable) {
  end(member);
  return;
 }

 const onboarding = await ch.cache.onboarding.get(member.guild.id);
 if (!onboarding || !onboarding.enabled) {
  end(member);
  return;
 }

 const promptsInQuestion = onboarding.prompts.filter((p) => p.inOnboarding);

 const allOf = promptsInQuestion
  .filter((p) => p.type === 1)
  .map((p) => p.options.map((o) => o.roleIds))
  .flat(Infinity) as string[];

 if (!allOf.every((r) => member.roles.cache.has(r))) {
  end(member);
  return;
 }

 const oneOf = promptsInQuestion
  .filter((p) => p.type === 0)
  .map((p) => p.options.map((o) => o.roleIds))
  .map((o) => o.flat());

 if (!oneOf.every((r) => member.roles.cache.hasAny(...r))) {
  end(member);
  return;
 }

 const dm = await member.user.createDM();
 await ch.send(dm, {
  content:
   'You have been kicked from the Server for picking the `Ban Me!` Role during Onboarding.\nYou can rejoin at any time: discord.gg/animekos',
 });

 member.kick('Most likely a Bot');
};

const end = (member: Discord.GuildMember) => {
 if (!member.roles.cache.has('1106249504325390336')) return;
 member.roles.remove('1106249504325390336');
};
