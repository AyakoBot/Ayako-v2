import * as Discord from 'discord.js';
import type * as ModTypes from '../mod.js';
import * as CT from '../../../Typings/CustomTypings.js';

import constants from '../../Other/constants.js';
import { request } from '../requestHandler.js';

export default async <T extends CT.ModTypes>(
 cmd: ModTypes.CmdType,
 message: ModTypes.ResponseMessage,
 language: CT.Language,
 options: CT.ModOptions<T>,
 type: T,
) => {
 if (!message) return;

 const { success } = language.mod.execution[type as keyof CT.Language['mod']['execution']];
 const embed = {
  color: constants.colors.success,
  description: success(options.target, options as never),
 };

 const payload = {
  embeds: [embed],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) request.channels.editMsg(message, payload);
};
