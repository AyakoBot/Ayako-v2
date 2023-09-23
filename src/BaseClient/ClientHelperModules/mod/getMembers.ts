import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

import { request } from '../requestHandler.js';
import constants from '../../Other/constants.js';
import objectEmotes from '../emotes.js';
import checkExeCanManage from './checkExeCanManage.js';
import type * as ModTypes from '../mod.js';

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
 if ('message' in targetMember) {
  if (!message) return undefined;

  const payload = {
   embeds: [
    {
     description: language.errors.memberNotFound,
     color: constants.colors.danger,
     author: { name: language.error, icon_url: objectEmotes.warning.link },
    },
   ],
  };

  if (message instanceof Discord.Message) request.channels.editMsg(message, payload);
  else message.edit(payload);

  return undefined;
 }

 if (!(await checkExeCanManage(cmd, targetMember, executorMember, message, language, type))) {
  return undefined;
 }

 return { executorMember, targetMember };
};
