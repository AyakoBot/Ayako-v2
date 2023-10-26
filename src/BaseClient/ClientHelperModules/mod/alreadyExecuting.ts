import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import type * as ModTypes from '../mod.js';
import constants from '../../Other/constants.js';
import replyMsg from '../replyMsg.js';
import replyCmd from '../replyCmd.js';
import getLanguage from '../getLanguage.js';
import { request } from '../requestHandler.js';
import isDeleteable from '../isDeleteable.js';

export default async (
 cmd: ModTypes.CmdType,
 executor: Discord.User,
 client: Discord.Client,
 replyMessage: ModTypes.ResponseMessage,
) => {
 if (!cmd) return;
 if (executor.id === client.user?.id) return;

 const language = await getLanguage(cmd.guildId);

 const payload = {
  embeds: [
   {
    color: constants.colors.danger,
    description: language.mod.alreadyExecuting,
   },
  ],
 };

 const updateExistingResponse = () => {
  if (!replyMessage) return undefined;

  if (replyMessage instanceof Discord.Message) {
   request.channels.editMessage(
    replyMessage.guild,
    replyMessage.channelId,
    replyMessage.id,
    payload,
   );
   return replyMessage;
  }

  (cmd as Discord.ChatInputCommandInteraction).editReply({ ...payload, message: replyMessage.id });
  return replyMessage;
 };

 const reply = replyMessage
  ? updateExistingResponse()
  : await (cmd instanceof Discord.Message ? replyMsg(cmd, payload) : replyCmd(cmd, payload));

 if (!reply) return;
 if (!(reply instanceof Discord.Message)) return;

 Jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
  if (await isDeleteable(reply)) request.channels.deleteMessage(reply);
 });
};
