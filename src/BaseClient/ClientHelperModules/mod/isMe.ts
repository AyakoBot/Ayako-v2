import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

import type * as ModTypes from '../mod.js';
import constants from '../../Other/constants.js';
import objectEmotes from '../emotes.js';
import { guild as getBotIdFromGuild } from '../getBotIdFrom.js';
import { request } from '../requestHandler.js';

export default async (
 cmd: ModTypes.CmdType,
 client: Discord.User,
 message: ModTypes.ResponseMessage,
 language: CT.Language,
 options: CT.BaseOptions,
 type: CT.ModTypes,
) => {
 if (options.target.id !== (cmd?.inGuild() ? await getBotIdFromGuild(cmd.guild) : client.id)) {
  return false;
 }
 if (!message) return true;

 const { me } = language.mod.execution[type as keyof CT.Language['mod']['execution']];

 const payload = {
  embeds: [
   {
    color: constants.colors.danger,
    author: {
     name: language.error,
     icon_url: objectEmotes.warning.link,
    },
    description: me,
   },
  ],
 };

 if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
 else if (message instanceof Discord.Message) request.channels.editMsg(message, payload);

 return true;
};
