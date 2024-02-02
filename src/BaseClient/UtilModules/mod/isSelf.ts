import * as Discord from 'discord.js';
import type * as CT from '../../../Typings/Typings.js';
import type * as ModTypes from '../mod.js';

export default (
 cmd: ModTypes.CmdType,
 executor: Discord.User,
 target: Discord.User,
 message: ModTypes.ResponseMessage,
 language: CT.Language,
 type: CT.ModTypes,
) => {
 if (executor.id !== target.id) return false;
 if (!message) return true;

 const { self } = language.mod.execution[type as keyof CT.Language['mod']['execution']];

 const payload = {
  embeds: [
   {
    color: executor.client.util.CT.Colors.Danger,
    author: {
     name: language.t.error,
     icon_url: executor.client.util.emotes.warning.link,
    },
    description: self,
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) {
  executor.client.util.request.channels.editMsg(message, payload);
 }

 return true;
};
