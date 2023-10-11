import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (
 reaction: Discord.MessageReaction,
 user: Discord.User,
 msg: Discord.Message<true>,
) => {
 const settings = await ch.DataBase.reactionrolesettings.findFirst({
  where: { msgid: msg.id, active: true, guildid: msg.guildId },
 });
 if (!settings) return;

 const reactionroles = await ch.DataBase.reactionroles.findMany({
  where: { linkedid: settings.uniquetimestamp, active: true, roles: { isEmpty: false } },
 });
 if (!reactionroles.length) return;

 const rolesToGive: string[] = reactionroles
  .filter((r) => r.emote === reaction.emoji.identifier)
  .map((r) => r.roles)
  .flat();

 rolesToGive.push(...settings.anyroles);

 const member = await ch.request.guilds
  .getMember(msg.guild, user.id)
  .then((r) => ('message' in r ? undefined : r));
 if (!member) return;

 const language = await ch.getLanguage(msg.guildId);
 ch.roleManager.add(member, rolesToGive, language.autotypes.reactionroles, 1);
};
