import * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

import banAdd from './banAdd.js';
import banRemove from './banRemove.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.SoftBanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const res = await banAdd(options, language, message, cmd);
 if (!res) return false;

 const res2 = await banRemove(options, language, message, cmd);
 if (!res2) return false;

 return true;
};
