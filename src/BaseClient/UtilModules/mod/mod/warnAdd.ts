import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.WarnAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const memberRes = await options.guild.client.util.mod.getMembers(
  cmd,
  options,
  language,
  message,
  options.guild.client.util.CT.ModTypes.WarnAdd,
 );
 if (memberRes && !memberRes.canExecute) return false;
 return true;
};
