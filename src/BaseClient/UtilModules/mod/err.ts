import * as Discord from 'discord.js';
import type * as CT from '../../../Typings/Typings.js';
import type * as ModTypes from '../mod.js';

export default (
 cmd: ModTypes.CmdType,
 errs: Discord.DiscordAPIError | Error,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 guild: Discord.Guild,
) => {
 if (cmd instanceof Discord.Message) {
  guild.client.util.errorMsg(cmd, errs.message, language, message as Discord.Message<true>);
  return;
 }

 if (!cmd) {
  guild.client.util.error(guild, new Error(errs.message));
  return;
 }
 guild.client.util.errorCmd(cmd, errs, language, message);
};
