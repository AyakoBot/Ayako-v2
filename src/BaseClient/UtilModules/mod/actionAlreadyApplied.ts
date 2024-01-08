import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

import type * as ModTypes from '../mod.js';
import { request } from '../requestHandler.js';

export default async (
 cmd: ModTypes.CmdType,
 message: ModTypes.ResponseMessage,
 target: Discord.User,
 language: CT.Language,
 type: CT.ModTypes,
) => {
 if (!message) return;

 const payload = {
  embeds: [
   {
    color: CT.Colors.Danger,
    description:
     language.mod.execution[type as keyof CT.Language['mod']['execution']].alreadyApplied(target),
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) request.channels.editMsg(message, payload);
};
