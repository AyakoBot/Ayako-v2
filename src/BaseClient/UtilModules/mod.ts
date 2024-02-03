import * as Discord from 'discord.js';
import type * as CT from '../../Typings/Typings.js';

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
 if (options.guild.client.util.cache.punishments.has(options.target.id)) {
  await options.guild.client.util.mod.alreadyExecuting(cmd, options.executor, replyMessage);
  return;
 }

 // TODO: Puhishments fail after here
 options.guild.client.util.cache.punishments.add(options.target.id);

 const basicsResponse = await runBasics1(options, cmd, type, replyMessage);
 if (!basicsResponse) {
  options.guild.client.util.cache.punishments.delete(options.target.id);
  return;
 }
 // and before here

 const { message, language } = basicsResponse;
 if (!options.reason.length) options.reason = language.t.noReasonProvided;

 const runAction = async () => {
  switch (type) {
   case options.guild.client.util.CT.ModTypes.BanAdd:
    return options.guild.client.util.mod.mod.banAdd(
     options as unknown as CT.ModOptions<CT.ModTypes.BanAdd>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.ChannelBanAdd:
    return options.guild.client.util.mod.mod.channelBanAdd(
     options as unknown as CT.ModOptions<CT.ModTypes.ChannelBanAdd>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.SoftBanAdd:
    return options.guild.client.util.mod.mod.softBanAdd(
     options as unknown as CT.ModOptions<CT.ModTypes.SoftBanAdd>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.KickAdd:
    return options.guild.client.util.mod.mod.kickAdd(options, language, message, cmd);
   case options.guild.client.util.CT.ModTypes.TempBanAdd:
    return options.guild.client.util.mod.mod.tempBanAdd(
     options as unknown as CT.ModOptions<CT.ModTypes.TempBanAdd>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.TempChannelBanAdd:
    return options.guild.client.util.mod.mod.tempChannelBanAdd(
     options as unknown as CT.ModOptions<CT.ModTypes.TempChannelBanAdd>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.TempMuteAdd:
    return options.guild.client.util.mod.mod.tempMuteAdd(
     options as unknown as CT.ModOptions<CT.ModTypes.TempMuteAdd>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.WarnAdd:
    return options.guild.client.util.mod.mod.warnAdd(options, language, message, cmd);
   case options.guild.client.util.CT.ModTypes.StrikeAdd:
    return options.guild.client.util.mod.mod.strikeAdd(options, language, message, cmd);
   case options.guild.client.util.CT.ModTypes.SoftWarnAdd:
    return options.guild.client.util.mod.mod.softWarnAdd();
   case options.guild.client.util.CT.ModTypes.RoleRemove:
    return options.guild.client.util.mod.mod.roleRemove(
     options as unknown as CT.ModOptions<CT.ModTypes.RoleRemove>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.RoleAdd:
    return options.guild.client.util.mod.mod.roleAdd(
     options as unknown as CT.ModOptions<CT.ModTypes.RoleAdd>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.MuteRemove:
    return options.guild.client.util.mod.mod.muteRemove(options, language, message, cmd);
   case options.guild.client.util.CT.ModTypes.ChannelBanRemove:
    return options.guild.client.util.mod.mod.channelBanRemove(
     options as unknown as CT.ModOptions<CT.ModTypes.ChannelBanRemove>,
     language,
     message,
     cmd,
    );
   case options.guild.client.util.CT.ModTypes.BanRemove:
    return options.guild.client.util.mod.mod.banRemove(options, language, message, cmd);
   case options.guild.client.util.CT.ModTypes.UnAfk:
    return options.guild.client.util.mod.mod.unAfk(options, language, message, cmd);
   default: {
    throw new Error(`Unknown modType ${type}`);
   }
  }
 };

 const action = await runAction();

 if (!action || (typeof action !== 'boolean' && !action.success)) {
  options.guild.client.util.cache.punishments.delete(options.target.id);
  return;
 }

 if (typeof action !== 'boolean') type = action.type as T;
 if (type === options.guild.client.util.CT.ModTypes.StrikeAdd) return;

 runBasics2(typeof action === 'boolean' ? options : action.options, message, language, type, cmd);
 options.guild.client.util.cache.punishments.delete(options.target.id);
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
 const language = await options.guild.client.util.getLanguage(options.guild.id);

 if (options.dbOnly) {
  options.guild.client.util.log(
   options.guild,
   type,
   options.target,
   options.executor,
   options as never,
  );
  await options.guild.client.util.mod.db(cmd, options, language, type);
  return false;
 }

 const message =
  replyMessage ?? (await options.guild.client.util.mod.startLoading(cmd, language, type));

 if (await options.guild.client.util.mod.isMe(cmd, message, language, options, type)) {
  return false;
 }

 if (
  options.guild.client.util.mod.isSelf(
   cmd,
   options.executor,
   options.target,
   message,
   language,
   type,
  )
 ) {
  return false;
 }

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
 options.guild.client.util.mod.declareSuccess(cmd, message, language, options, type);
 options.guild.client.util.log(
  options.guild,
  type,
  options.target,
  options.executor,
  options as never,
 );
 options.guild.client.util.mod.db(cmd, options, language, type).then();
 options.guild.client.util.mod.notifyTarget(options, language, type);
};
