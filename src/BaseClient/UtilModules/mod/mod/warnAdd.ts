import * as CT from '../../../../Typings/Typings.js';

import getMembers from '../getMembers.js';

import type * as ModTypes from '../../mod.js';
import rmVotePunish from '../rmVotePunish.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.WarnAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const memberRes = await getMembers(cmd, options, language, message, CT.ModTypes.WarnAdd);
 if (memberRes && !memberRes.canExecute) return false;
 
 rmVotePunish(options, memberRes?.executorMember, cmd?.channelId)
 return true;
};
