import * as Discord from 'discord.js';
import type * as CT from '../../../Typings/Typings.js';
import type * as ModTypes from '../mod.js';

export default async (
 cmd: ModTypes.CmdType,
 target: Discord.GuildMember,
 executor: Discord.GuildMember,
 message: ModTypes.ResponseMessage,
 language: CT.Language,
 type: CT.ModTypes,
): Promise<boolean> => {
 if (target.roles.highest.position < executor.roles.highest.position) return true;
 if (!message) return false;

 const payload = {
  embeds: [
   {
    color: executor.client.util.CT.Colors.Danger,
    author: {
     icon_url: executor.client.util.emotes.warning.link,
     name: language.t.error,
    },
    description: language.mod.execution[type as keyof CT.Language['mod']['execution']].youNoPerms,
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) {
  executor.client.util.request.channels.editMsg(message, payload);
 }

 return false;
};
