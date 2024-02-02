import * as Discord from 'discord.js';
import type * as CT from '../../../Typings/Typings.js';
import type * as ModTypes from '../mod.js';

export default async (
 cmd: ModTypes.CmdType,
 message: ModTypes.ResponseMessage,
 language: CT.Language,
 options: CT.BaseOptions,
 type: CT.ModTypes,
) => {
 if (
  options.target.id !==
  (cmd?.inGuild()
   ? await options.guild.client.util.getBotIdFromGuild(cmd.guild)
   : options.guild.client.user.id)
 ) {
  return false;
 }
 if (!message) return true;

 const { me } = language.mod.execution[type as keyof CT.Language['mod']['execution']];

 const payload = {
  embeds: [
   {
    color: options.guild.client.util.CT.Colors.Danger,
    author: {
     name: language.t.error,
     icon_url: options.guild.client.util.emotes.warning.link,
    },
    description: me,
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) {
  options.guild.client.util.request.channels.editMsg(message, payload);
 }

 return true;
};
