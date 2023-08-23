import * as CT from '../../../Typings/CustomTypings.js';

import { request } from '../requestHandler.js';
import constants from '../../Other/constants.js';
import objectEmotes from '../objectEmotes.js';
import checkExeCanManage from './checkExeCanManage.js';
import type * as ModTypes from '../mod.js';
import { GuildMember } from '../../Other/classes.js';

export default async (
 cmd: ModTypes.CmdType,
 options: CT.BaseOptions,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 type: CT.ModTypes,
) => {
 const executorMember = await request.guilds.getMember(options.guild, options.executor.id);
 if ('message' in executorMember) return undefined;

 const targetMember = await options.guild.members.fetch(options.target.id).catch(() => undefined);
 if (!targetMember) {
  message?.edit({
   embeds: [
    {
     description: language.errors.memberNotFound,
     color: constants.colors.danger,
     author: { name: language.error, icon_url: objectEmotes.warning.link },
    },
   ],
  });

  return undefined;
 }

 if (
  !(await checkExeCanManage(
   cmd,
   targetMember,
   new GuildMember(options.guild.client, executorMember, options.guild),
   message,
   language,
   type,
  ))
 ) {
  return undefined;
 }

 return { executorMember, targetMember };
};
