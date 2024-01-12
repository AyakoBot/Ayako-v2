import * as Discord from 'discord.js';

export default async (
 reaction: Discord.MessageReaction,
 user: Discord.User,
 msg: Discord.Message<true>,
) => {
 const settings = await reaction.client.util.DataBase.reactionrolesettings.findFirst({
  where: { msgid: msg.id, active: true, guildid: msg.guildId },
 });
 if (!settings) return;

 const reactionroles = await reaction.client.util.DataBase.reactionroles.findMany({
  where: { linkedid: settings.uniquetimestamp, active: true, roles: { isEmpty: false } },
 });
 if (!reactionroles.length) return;

 const rolesToRemove: string[] = reactionroles
  .filter((r) => r.emote === decodeURI(reaction.emoji.identifier))
  .map((r) => r.roles)
  .flat();
 if (!rolesToRemove.length) return;

 const member = await reaction.client.util.request.guilds
  .getMember(msg.guild, user.id)
  .then((r) => ('message' in r ? undefined : r));
 if (!member) return;

 if (
  !reactionroles
   .map((r) => r.roles)
   .flat()
   .filter((r) => !rolesToRemove.includes(r))
   .some((r) => member.roles.cache.has(r))
 ) {
  rolesToRemove.push(...settings.anyroles);
 }

 const language = await reaction.client.util.getLanguage(msg.guildId);
 reaction.client.util.roleManager.remove(
  member,
  rolesToRemove,
  language.autotypes.reactionroles,
  1,
 );
};
