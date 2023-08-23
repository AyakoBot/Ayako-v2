import * as Discord from 'discord.js';
import * as CT from '../../Typings/CustomTypings.js';
import languageSelector from './languageSelector.js';
import log from './log.js';

import db from './mod/db.js';
import mod from './mod/mod.js';
import declareSuccess from './mod/declareSuccess.js';
import notifyTarget from './mod/notifyTarget.js';
import isMe from './mod/isMe.js';
import isSelf from './mod/isSelf.js';
import startLoading from './mod/startLoading.js';

export type CmdType =
 | Discord.ChatInputCommandInteraction<'cached'>
 | Discord.Message<true>
 | undefined;
export type ResponseMessage = Discord.InteractionResponse<true> | Discord.Message<true> | undefined;

export default async <T extends CT.ModTypes>(cmd: CmdType, type: T, options: CT.ModOptions<T>) => {
 const basicsResponse = await runBasics1(options, cmd, type);
 if (!basicsResponse) return;
 const { message, language } = basicsResponse;

 const runAction = async () => {
  switch (type) {
   case 'banAdd':
    return mod.banAdd(options as unknown as CT.ModOptions<'banAdd'>, language, message, cmd);
   case 'channelBanAdd':
    return mod.channelBanAdd(
     options as unknown as CT.ModOptions<'channelBanAdd'>,
     language,
     message,
     cmd,
    );
   case 'softBanAdd':
    return mod.softBanAdd(
     options as unknown as CT.ModOptions<'softBanAdd'>,
     language,
     message,
     cmd,
    );
   case 'kickAdd':
    return mod.kickAdd(options, language, message, cmd);
   case 'tempBanAdd':
    return mod.tempBanAdd(
     options as unknown as CT.ModOptions<'tempBanAdd'>,
     language,
     message,
     cmd,
    );
   case 'tempChannelBanAdd':
    return mod.tempChannelBanAdd(
     options as unknown as CT.ModOptions<'tempChannelBanAdd'>,
     language,
     message,
     cmd,
    );
   case 'tempMuteAdd':
    return mod.tempMuteAdd(
     options as unknown as CT.ModOptions<'tempMuteAdd'>,
     language,
     message,
     cmd,
    );
   case 'warnAdd':
    return mod.warnAdd();
   case 'strikeAdd':
    return mod.strikeAdd(options, language, message, cmd);
   case 'softWarnAdd':
    return mod.softWarnAdd();
   case 'roleRemove':
    return mod.roleRemove(
     options as unknown as CT.ModOptions<'roleRemove'>,
     language,
     message,
     cmd,
    );
   case 'roleAdd':
    return mod.roleAdd(options as unknown as CT.ModOptions<'roleAdd'>, language, message, cmd);
   case 'muteRemove':
    return mod.muteRemove(options, language, message, cmd);
   case 'channelBanRemove':
    return mod.channelBanRemove(
     options as unknown as CT.ModOptions<'channelBanRemove'>,
     language,
     message,
     cmd,
    );
   case 'banRemove':
    return mod.banRemove(options, language, message, cmd);
   default: {
    throw new Error(`Unknown modType ${type}`);
   }
  }
 };

 if (!(await runAction())) return;

 runBasics2(options, message, language, type, cmd);
};

const runBasics1 = async (options: CT.BaseOptions, cmd: CmdType, type: CT.ModTypes) => {
 const language = await languageSelector(options.guild.id);

 if (options.dbOnly) {
  log(options.guild, type, options.target, options.executor, options);
  await db(cmd, options, language, type);
  return false;
 }

 const message = await startLoading(cmd, language, type);

 if (await isMe(cmd, options.guild.client.user, message, language, options, type)) return false;
 if (isSelf(cmd, options.executor, options.target, message, language, type)) return false;

 return { message, language };
};

const runBasics2 = async (
 options: CT.BaseOptions,
 message: ResponseMessage,
 language: CT.Language,
 type: CT.ModTypes,
 cmd: CmdType,
) => {
 declareSuccess(cmd, message, language, options, type);
 log(options.guild, type, options.target, options.executor, options);
 await db(cmd, options, language, type);
 notifyTarget(options, language, type);
};
