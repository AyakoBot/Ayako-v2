import * as Discord from 'discord.js';
import type * as CT from '../../../Typings/Typings.js';
import type * as ModTypes from '../mod.js';

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
    color: message.client.util.CT.Colors.Danger,
    author: {
     icon_url: language.client.util.emotes.warning.link,
     name: language.t.error,
    },
    description: language.mod.execution[type as keyof CT.Language['mod']['execution']].meNoPerms,
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) {
  language.client.util.request.channels.editMsg(message, payload);
 }

 return false;
};
