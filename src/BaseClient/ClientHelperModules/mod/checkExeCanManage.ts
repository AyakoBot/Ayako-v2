import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

import { request } from '../requestHandler.js';
import constants from '../../Other/constants.js';
import objectEmotes from '../emotes.js';
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
    color: constants.colors.danger,
    author: {
     icon_url: objectEmotes.warning.link,
     name: language.t.error,
    },
    description: language.mod.execution[type as keyof CT.Language['mod']['execution']].youNoPerms,
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) request.channels.editMsg(message, payload);

 return false;
};
