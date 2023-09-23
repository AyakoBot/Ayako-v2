import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

import constants from '../../Other/constants.js';
import objectEmotes from '../emotes.js';
import type * as ModTypes from '../mod.js';
import replyMsg from '../replyMsg.js';
import replyCmd from '../replyCmd.js';

export default async (
 cmd: ModTypes.CmdType,
 language: CT.Language,
 type: CT.ModTypes,
): Promise<ModTypes.ResponseMessage> => {
 if (!cmd) return undefined;

 const payload = {
  embeds: [
   {
    color: constants.colors.loading,
    author: {
     icon_url: objectEmotes.loading.link,
     name: language.mod.execution[type as keyof typeof language.mod.execution].loading,
    },
   },
  ],
 };

 if (cmd instanceof Discord.Message) {
  return replyMsg(cmd, payload);
 }
 return replyCmd(cmd, { ...payload, fetchReply: true });
};
