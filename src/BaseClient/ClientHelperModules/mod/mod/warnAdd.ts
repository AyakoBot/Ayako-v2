import * as CT from '../../../../Typings/Typings.js';

import getMembers from '../getMembers.js';

import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.WarnAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const memberRes = await getMembers(cmd, options, language, message, CT.ModTypes.WarnAdd);
 if (memberRes && !memberRes.canExecute) return false;
 return true;
};
