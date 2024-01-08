import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import type * as ModTypes from '../mod.js';

import { request } from '../requestHandler.js';
import send from '../send.js';

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
  color: CT.Colors.Success,
  description: success(options.target, options as never),
 };

 const payload = {
  embeds: [embed],
 };

 if ((cmd instanceof Discord.Message || !cmd) && message instanceof Discord.Message) {
  request.channels.editMsg(message, payload);
  return;
 }
 if (cmd instanceof Discord.Message) return;
 if (!cmd) return;

 cmd.deleteReply();
 send({ id: cmd.channelId, guildId: cmd.guildId }, payload);
};
