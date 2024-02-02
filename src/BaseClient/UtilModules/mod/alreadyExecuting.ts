import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import type * as ModTypes from '../mod.js';

export default async (
 cmd: ModTypes.CmdType,
 executor: Discord.User,
 replyMessage: ModTypes.ResponseMessage,
) => {
 if (!cmd) return;
 if (executor.id === executor.client.user.id) return;

 const language = await executor.client.util.getLanguage(cmd.guildId);

 const payload = {
  embeds: [
   {
    color: executor.client.util.CT.Colors.Danger,
    description: language.mod.alreadyExecuting,
   },
  ],
 };

 const updateExistingResponse = () => {
  if (!replyMessage) return undefined;

  if (replyMessage instanceof Discord.Message) {
   executor.client.util.request.channels.editMessage(
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
  : await (cmd instanceof Discord.Message
     ? executor.client.util.replyMsg(cmd, payload)
     : executor.client.util.replyCmd(cmd, payload));

 if (!reply) return;
 if (!(reply instanceof Discord.Message)) return;

 Jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
  if (await executor.client.util.isDeleteable(reply)) {
   executor.client.util.request.channels.deleteMessage(reply);
  }
 });
};
