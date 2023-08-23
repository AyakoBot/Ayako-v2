import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

import type * as ModTypes from '../mod.js';
import DataBase from '../../DataBase.js';
import constants from '../../Other/constants.js';
import objectEmotes from '../objectEmotes.js';
import getBotIdFromToken from '../getBotIdFromToken.js';
import { request } from '../requestHandler.js';

export default async (
 cmd: ModTypes.CmdType,
 client: Discord.User,
 message: ModTypes.ResponseMessage,
 language: CT.Language,
 options: CT.BaseOptions,
 type: CT.ModTypes,
) => {
 const tokenSettings = await DataBase.guildsettings.findUnique({
  where: { guildid: options.guild.id, token: { not: null } },
 });
 if (
  options.target.id !== (tokenSettings?.token ? getBotIdFromToken(tokenSettings.token) : client.id)
 ) {
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
