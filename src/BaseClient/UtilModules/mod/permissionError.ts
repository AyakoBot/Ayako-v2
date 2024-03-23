import * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import * as CT from '../../../Typings/Typings.js';

import objectEmotes from '../emotes.js';
import type * as ModTypes from '../mod.js';
import { request } from '../requestHandler.js';
import getPathFromError from '../getPathFromError.js';

export default async (
 cmd: ModTypes.CmdType,
 message: ModTypes.ResponseMessage,
 language: CT.Language,
 type: CT.ModTypes,
): Promise<boolean> => {
 if (!message) return false;

 const payload = {
  embeds: [
   {
    color: CT.Colors.Danger,
    author: {
     icon_url: objectEmotes.warning.link,
     name: language.t.error,
    },
    description: language.mod.execution[type as keyof CT.Language['mod']['execution']].meNoPerms,
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) {
  await request.channels.editMsg(message, payload);

  scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), () => {
   request.channels.deleteMessage(message);
  });
 }

 return false;
};
