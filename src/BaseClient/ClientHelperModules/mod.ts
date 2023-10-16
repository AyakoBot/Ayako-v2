import * as Discord from 'discord.js';
import * as CT from '../../Typings/CustomTypings.js';

import getLanguage from './getLanguage.js';
import log from './log.js';
import db from './mod/db.js';
import mod from './mod/mod.js';
import declareSuccess from './mod/declareSuccess.js';
import notifyTarget from './mod/notifyTarget.js';
import isMe from './mod/isMe.js';
import isSelf from './mod/isSelf.js';
import startLoading from './mod/startLoading.js';
import alreadyExecuting from './mod/alreadyExecuting.js';
import cache from './cache.js';

export type CmdType =
 | Discord.ChatInputCommandInteraction<'cached'>
 | Discord.Message<true>
 | undefined;
export type ResponseMessage = Discord.InteractionResponse<true> | Discord.Message<true> | undefined;

/**
 * Runs the specified moderation action based on the given command type,
 * moderation type, and options.
 * @template T The type of moderation action to run.
 * @param {CmdType} cmd The command type.
 * @param {T} type The moderation type.
 * @param {CT.ModOptions<T>} options The options for the moderation action.
 * @param {ResponseMessage} replyMessage The response message object.
 * @returns {Promise<void>} A Promise that resolves when the moderation action has been completed.
 * @throws {Error} If the given moderation type is unknown.
 */
export default async <T extends CT.ModTypes>(
 cmd: CmdType,
 type: T,
 options: CT.ModOptions<T>,
 replyMessage?: ResponseMessage,
) => {
 if (cache.punishments.has(options.target.id)) {
  await alreadyExecuting(cmd, options.executor, options.guild.client, replyMessage);
  return;
 }
 cache.punishments.add(options.target.id);

 const basicsResponse = await runBasics1(options, cmd, type, replyMessage);
 if (!basicsResponse) {
  cache.punishments.delete(options.target.id);
  return;
 }
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

 if (!(await runAction())) {
  cache.punishments.delete(options.target.id);
  return;
 }

 runBasics2(options, message, language, type, cmd);
 cache.punishments.delete(options.target.id);
};

/**
 * Runs basic checks and operations for a client helper module.
 * @param options - The options for the operation.
 * @param cmd - The command being executed.
 * @param type - The type of the module.
 * @param replyMessage - The message that was replied with.
 * @returns An object containing the message and language, or false if certain conditions are met.
 */
const runBasics1 = async (
 options: CT.BaseOptions,
 cmd: CmdType,
 type: CT.ModTypes,
 replyMessage: ResponseMessage,
) => {
 const language = await getLanguage(options.guild.id);

 if (options.dbOnly) {
  log(options.guild, type, options.target, options.executor, options as never);
  await db(cmd, options, language, type);
  return false;
 }

 const message = replyMessage ?? (await startLoading(cmd, language, type));

 if (await isMe(cmd, options.guild.client.user, message, language, options, type)) return false;
 if (isSelf(cmd, options.executor, options.target, message, language, type)) return false;

 return { message, language };
};

/**
 * Runs basic operations for a mod command.
 * @param options - The options for the mod command.
 * @param message - The response message object.
 * @param language - The language object.
 * @param type - The type of mod command.
 * @param cmd - The command object.
 */
const runBasics2 = async (
 options: CT.BaseOptions,
 message: ResponseMessage,
 language: CT.Language,
 type: CT.ModTypes,
 cmd: CmdType,
) => {
 declareSuccess(cmd, message, language, options, type);
 log(options.guild, type, options.target, options.executor, options as never);
 db(cmd, options, language, type).then();
 notifyTarget(options, language, type);
};
