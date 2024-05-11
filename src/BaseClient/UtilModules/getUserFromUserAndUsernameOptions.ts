import * as Discord from 'discord.js';
import errorCmd from './errorCmd.js';
import getUser from './getUser.js';
import getLanguage from './getLanguage.js';
import { request } from './requestHandler.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const userID = cmd.options.get('user-name', false)?.value as string | null;
 const language = await getLanguage(cmd.guild?.id);

 if (userID && userID.replace(/\D+/g, '').length !== userID.length) {
  errorCmd(cmd, language.errors.userNotFound, language);
  return undefined;
 }

 const user =
  cmd.options.getUser('user', false) ??
  (userID ? await getUser(userID).catch(() => undefined) : cmd.user) ??
  cmd.user;

 const member = cmd.guild
  ? (await request.guilds.getMember(cmd.guild, user.id).then((m) => ('message' in m ? null : m))) ??
    undefined
  : undefined;

 return { user, member, language };
};
