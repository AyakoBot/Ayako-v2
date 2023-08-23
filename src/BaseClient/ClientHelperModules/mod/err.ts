import * as Discord from 'discord.js';
import type * as ModTypes from '../mod.js';
import * as CT from '../../../Typings/CustomTypings.js';

import errorMsg from '../errorMsg.js';
import errorCmd from '../errorCmd.js';
import error from '../error.js';

export default (
 cmd: ModTypes.CmdType,
 errs: Discord.DiscordAPIError,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 guild: Discord.Guild,
) => {
 if (cmd instanceof Discord.Message) {
  errorMsg(cmd, errs.message, language, message as Discord.Message<true>);
  return;
 }

 if (!cmd) {
  error(guild, new Error(errs.message));
  return;
 }
 errorCmd(cmd, errs.message, language, message);
};
