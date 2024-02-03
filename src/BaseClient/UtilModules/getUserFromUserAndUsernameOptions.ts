import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const userID = cmd.options.get('user-name', false)?.value as string | null;
 const language = await cmd.client.util.getLanguage(cmd.guild?.id);

 if (userID && userID.replace(/\D+/g, '').length !== userID.length) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
  return undefined;
 }

 const user =
  cmd.options.getUser('user', false) ??
  (userID ? await cmd.client.util.getUser(userID).catch(() => undefined) : cmd.user) ??
  cmd.user;

 const member = cmd.guild
  ? (await cmd.client.util.request.guilds
     .getMember(cmd.guild, user.id)
     .then((m) => ('message' in m ? null : m))) ?? undefined
  : undefined;

 return {
  user,
  member,
  language,
 };
};
