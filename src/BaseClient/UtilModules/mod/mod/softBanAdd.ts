import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.SoftBanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const res = await options.guild.client.util.mod.mod.banAdd(options, language, message, cmd);
 if (!res) return false;

 const res2 = await options.guild.client.util.mod.mod.banRemove(options, language, message, cmd);
 if (!res2) return false;

 return true;
};
