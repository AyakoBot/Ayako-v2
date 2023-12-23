import * as CT from '../../../Typings/Typings.js';

import type * as ModTypes from '../mod.js';
import { request } from '../requestHandler.js';
import checkExeCanManage from './checkExeCanManage.js';

export default async (
 cmd: ModTypes.CmdType,
 options: CT.BaseOptions,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 type: CT.ModTypes,
) => {
 const executorMember = await request.guilds.getMember(options.guild, options.executor.id);
 if ('message' in executorMember) return undefined;

 const targetMember = await request.guilds.getMember(options.guild, options.target.id);
 if ('message' in targetMember) return undefined;

 if (!(await checkExeCanManage(cmd, targetMember, executorMember, message, language, type))) {
  return undefined;
 }

 return { executorMember, targetMember };
};
