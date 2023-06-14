import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import type * as CT from '../../Typings/CustomTypings';
import languageSelector from './languageSelector.js';
import constants from '../Other/constants.js';
import stringEmotes from './stringEmotes.js';
import replyMsg from './replyMsg.js';
import replyCmd from './replyCmd.js';
import errorCmd from './errorCmd.js';
import errorMsg from './errorMsg.js';
import emitError from './error.js';
import send from './send.js';
import client from '../Client.js';
import cache from './cache.js';
import log from './log.js';
import query from './query.js';

type CmdType = Discord.ChatInputCommandInteraction<'cached'> | Discord.Message;

const run = async <T extends CT.ModTypes>(
 cmd: Discord.ChatInputCommandInteraction | Discord.Message | undefined,
 type: T,
 options: CT.ModOptions<T>,
) => {
 if (cmd) {
  if (!cmd.inGuild()) return;
  if ('inCachedGuild' in cmd && !cmd.inCachedGuild()) return;
 }

 const language = await languageSelector(options.guild.id);
 const lan = language.mod.execution[type];

 const target = options.target
  ? await client.users.fetch(options.target.id).catch(() => undefined)
  : undefined ??
    (cmd instanceof Discord.Message
     ? cmd.mentions.users.first()
     : cmd?.options.getUser('user', true));
 if (!target) {
  emitError(options.guild, new Error('Target not found'));
  return;
 }

 const targetMember =
  cmd instanceof Discord.Message
   ? cmd.mentions.members.first()
   : cmd?.options.getMember('user') ??
     (await options.guild.members.fetch(target).catch(() => undefined));

 const executor = options.executor
  ? await client.users.fetch(options.executor.id).catch(() => undefined)
  : undefined ?? (cmd instanceof Discord.Message ? cmd.author : cmd?.user);
 if (!executor) {
  emitError(options.guild, new Error('Executor not found'));
  return;
 }

 const executorMember = cmd?.member ?? options.guild.members.cache.get(executor.id);

 if (options.dbOnly) {
  doDB(cmd, type, options, executor, target);
  return;
 }

 if (!executorMember) return;

 if (!target) {
  if (cmd instanceof Discord.Message) errorMsg(cmd, language.errors.noUserMentioned, language);
  else if (cmd) errorCmd(cmd, language.errors.noUserMentioned, language);
  return;
 }

 const message = await loadingEmbed(language, cmd);
 if (!options.forceFinish && cmd) {
  if (!message) return;

  const isSelfPunish = target.id === executor.id;
  if (isSelfPunish) {
   await error(cmd, `${stringEmotes.cross} ${lan.self}`, language, message);
   return;
  }

  const isMePunish = target.id === client.user?.id;
  if (isMePunish) {
   await error(cmd, `${stringEmotes.cross} ${lan.me}`, language, message);
   return;
  }

  const roleCheckAllowed = options.forceFinish
   ? true
   : await roleCheck(targetMember, executorMember, options);
  if (!roleCheckAllowed) {
   await error(cmd, `${stringEmotes.cross} ${lan.youNoPerms}`, language, message);
   return;
  }

  const passesAdditionalChecks = await additionalChecks(type, options, executorMember);
  if (!passesAdditionalChecks && 'additionalChecksFailed' in lan) {
   await error(cmd, `${stringEmotes.cross} ${lan.additionalChecksFailed}`, language, message);
   return;
  }

  const isPunishable = checkPunishable(targetMember, type, options);
  if (!isPunishable) {
   await error(cmd, `${stringEmotes.cross} ${lan.meNoPerms}`, language, message);
   return;
  }

  const alreadyPunished = await checkPunished(targetMember, target, type, options);
  if (alreadyPunished) {
   await error(cmd, `${stringEmotes.cross} ${lan.alreadyApplied(target)}`, language, message);
   return;
  }
 }

 const dm = await doDM(target, type, lan, options, language);

 const actionOrError = await doAction(cmd, type, options, targetMember, target, executor, language);
 if (cmd && (!actionOrError || 'message' in (actionOrError as Discord.DiscordAPIError))) {
  if (dm?.deletable) dm.delete().catch(() => undefined);
  await error(
   cmd,
   `${stringEmotes.cross} ${(actionOrError as Discord.DiscordAPIError)?.message ?? language.error}`,
   language,
   message,
  );
  return;
 }

 doDB(cmd, type, options, executor, target, message);
 log(options.guild, type, target, executor, options);

 if (message instanceof Discord.Message && cmd) {
  message?.edit({
   embeds: [
    new Discord.EmbedBuilder(message.embeds[0].data).setDescription(
     `${stringEmotes.tick} ${lan.success(target, options as never)}`,
    ).data,
   ],
  });
 } else if (cmd) {
  message?.delete().catch(() => undefined);
  send(
   { guildId: options.guild.id, id: cmd.channelId },
   {
    embeds: [
     {
      color: constants.colors[constants.modColors[type]],
      description: `${stringEmotes.tick} ${lan.success(target, options as never)}`,
     },
    ],
   },
  );
 }
};

const additionalChecks = async <T extends CT.ModTypes>(
 type: T,
 options: CT.ModOptions<T>,
 executorMember: Discord.GuildMember,
) => {
 switch (type) {
  case 'roleAdd':
  case 'roleRemove': {
   const opts = options as CT.ModOptions<'roleAdd' | 'roleRemove'>;
   if (executorMember.roles.highest.position < opts.role.position) return false;
   if (Number(opts.guild.members.me?.roles.highest.position) < opts.role.position) return false;
   return true;
  }
  default: {
   return true;
  }
 }
};

const doDB = <T extends CT.ModTypes>(
 cmd: CmdType | undefined,
 type: T,
 options: CT.ModOptions<T>,
 executor: Discord.User,
 target: Discord.User,
 message?: Discord.Message | Discord.InteractionResponse | undefined,
) => {
 const getAndDeleteRow = async (
  table: string,
  insertTable: string,
  extraSelectArgs?: unknown[],
  extraArgs?: unknown[],
  extraInsertArgNames?: unknown[],
  extraInsertArgs?: unknown[],
 ) => {
  const selectArray = extraArgs
   ? [target?.id, options.guild.id, ...extraArgs]
   : [target?.id, options.guild.id];

  const punishRow = await query(
   `SELECT * FROM ${table} WHERE userid = $1 AND guildid = $2 ${
    extraSelectArgs ? `${extraSelectArgs.map((arg, i) => `AND ${arg} = $${i + 3}`).join('')}` : ''
   }`,
   selectArray,
   { returnType: 'Punishment', asArray: false },
  );

  if (punishRow) {
   await query(
    `DELETE FROM ${table} WHERE userid = $1 AND guildid = $2 AND uniquetimestamp = $3;`,
    [target?.id, options.guild.id, punishRow.uniquetimestamp],
   ); // js

   const insertArgs = extraInsertArgs
    ? [
       punishRow.guildid,
       punishRow.userid,
       punishRow.reason,
       punishRow.uniquetimestamp,
       punishRow.channelid,
       punishRow.channelname,
       punishRow.executorid,
       punishRow.executorname,
       punishRow.msgid,
       ...extraInsertArgs,
      ]
    : [
       punishRow.guildid,
       punishRow.userid,
       punishRow.reason,
       punishRow.uniquetimestamp,
       punishRow.channelid,
       punishRow.channelname,
       punishRow.executorid,
       punishRow.executorname,
       punishRow.msgid,
      ];

   if (
    !extraInsertArgs ||
    (extraInsertArgNames && extraInsertArgs.length < extraInsertArgNames.length)
   ) {
    const cloneArr = extraInsertArgNames?.slice();
    cloneArr?.splice(
     0,
     Math.abs((extraInsertArgs?.length ?? 0) - (extraInsertArgNames?.length ?? 0)),
    );

    insertArgs.push(...(cloneArr?.map((arg) => punishRow[arg as never]) ?? []));
   }

   await query(
    `INSERT INTO ${insertTable} (guildid, userid, reason, uniquetimestamp, channelid, channelname, executorid, executorname, msgid${
     extraInsertArgNames ? `, ${extraInsertArgNames.join(', ')}` : ''
    }) VALUES
    (${insertArgs ? `${insertArgs.map((_, i) => `$${i + 1}`).join(', ')}` : ''});`,
    insertArgs,
   );
   return punishRow;
  }
  return null;
 };

 const insertRow = (table: string, extraArgNames?: unknown[], extraArgs?: unknown[]) => {
  const insertArgs = extraArgs
   ? [
      options.guild.id,
      target?.id,
      options.reason,
      Date.now(),
      cmd?.channelId,
      (cmd?.channel as Discord.GuildBasedChannel | null)?.name,
      executor.id,
      constants.standard.user(executor),
      message?.id,
      ...extraArgs,
     ]
   : [
      options.guild.id,
      target?.id,
      options.reason,
      Date.now(),
      cmd?.channelId,
      (cmd?.channel as Discord.GuildBasedChannel | null)?.name,
      executor.id,
      constants.standard.user(executor),
      message?.id,
     ];

  query(
   `INSERT INTO ${table} (guildid, userid, reason, uniquetimestamp, channelid, channelname, executorid, executorname, msgid${
    extraArgNames ? `, ${extraArgNames.join(', ')}` : '' // `
   }) VALUES (
      ${insertArgs ? `${insertArgs.map((_, i) => `$${i + 1}`).join(', ')}` : ''});`,
   insertArgs,
  );
 };

 switch (type) {
  case 'muteRemove': {
   getAndDeleteRow('punish_tempmutes', 'punish_mutes', undefined, undefined, ['duration']);
   break;
  }
  case 'tempMuteAdd': {
   const opts = options as CT.ModOptions<'tempMuteAdd'>;
   insertRow('punish_tempmutes', ['duration'], [String(opts.duration)]);
   break;
  }
  case 'banAdd':
  case 'softBanAdd': {
   insertRow('punish_bans');
   break;
  }
  case 'tempBanAdd': {
   const opts = options as CT.ModOptions<'tempBanAdd'>;
   insertRow('punish_tempbans', ['duration'], [String(opts.duration)]);
   break;
  }
  case 'channelBanAdd': {
   const opts = options as CT.ModOptions<'channelBanAdd'>;
   insertRow('punish_channelbans', ['banchannelid'], [opts.channel?.id]);
   break;
  }
  case 'tempChannelBanAdd': {
   const opts = options as CT.ModOptions<'tempChannelBanAdd'>;
   insertRow(
    'punish_tempchannelbans',
    ['banchannelid', 'duration'],
    [opts.channel?.id, String(opts.duration)],
   );
   break;
  }
  case 'channelBanRemove': {
   const opts = options as CT.ModOptions<'tempChannelBanAdd'>;
   getAndDeleteRow(
    'punish_tempchannelbans',
    'punish_channelbans',
    ['banchannelid'],
    [opts.channel?.id],
    ['banchannelid', 'duration'],
    [opts.channel?.id],
   );
   break;
  }
  case 'banRemove': {
   getAndDeleteRow('punish_tempbans', 'punish_bans', undefined, undefined, ['duration']);
   break;
  }
  case 'kickAdd': {
   insertRow('punish_kicks');
   break;
  }
  case 'warnAdd': {
   insertRow('punish_warns');
   break;
  }
  default: {
   break;
  }
 }
};

export default run;

const doAction = async <T extends CT.ModTypes>(
 cmd: CmdType | undefined,
 type: T,
 options: CT.ModOptions<T>,
 targetMember: Discord.GuildMember | undefined | null,
 target: Discord.User,
 executor: Discord.User,
 language: CT.Language,
) => {
 const readyLan = language.events.ready;

 switch (type) {
  case 'muteRemove': {
   return targetMember
    ?.timeout(
     null,
     `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
    )
    .catch((err: Discord.DiscordAPIError) => err);
  }
  case 'tempMuteAdd': {
   const opts = options as CT.ModOptions<'tempMuteAdd'>;

   const timeout = await targetMember
    ?.timeout(
     opts.duration,
     `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
    )
    .catch((err: Discord.DiscordAPIError) => err);

   if (!(timeout instanceof Discord.GuildMember)) return timeout;

   cache.mutes.set(
    Jobs.scheduleJob(new Date(Date.now() + opts.duration), async () =>
     run(cmd, 'muteRemove', {
      forceFinish: true,
      target,
      reason: readyLan.unmute,
      guild: options.guild,
      dbOnly: false,
     }),
    ),
    options.guild.id,
    targetMember?.id as string,
   );

   return timeout;
  }
  case 'banAdd': {
   let deleteMessageSeconds = 7 * 24 * 60 * 60;
   if (targetMember?.roles.cache.has('703694514035884162')) deleteMessageSeconds = 0; // TODO

   return options.guild.bans
    .create(target.id, {
     deleteMessageSeconds,
     reason: `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
    })
    .catch((err: Discord.DiscordAPIError) => err);
  }
  case 'tempBanAdd':
  case 'softBanAdd': {
   let deleteMessageSeconds = 7 * 24 * 60 * 60;
   if (targetMember?.roles.cache.has('703694514035884162')) deleteMessageSeconds = 0;

   const ban = await options.guild.bans
    .create(target.id, {
     deleteMessageSeconds,
     reason: `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
    })
    .catch((err: Discord.DiscordAPIError) => err);

   if (
    typeof ban !== 'string' &&
    !(ban instanceof Discord.User) &&
    !(ban instanceof Discord.GuildMember)
   ) {
    return ban;
   }

   if (type === 'softBanAdd') {
    return options.guild.bans
     .remove(
      target.id,
      `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
     )
     .catch((err: Discord.DiscordAPIError) => err);
   }

   const opts = options as CT.ModOptions<'tempBanAdd'>;
   cache.bans.set(
    Jobs.scheduleJob(new Date(Date.now() + opts.duration), () =>
     run(cmd, 'banRemove', {
      target,
      reason: readyLan.unban,
      guild: options.guild,
      dbOnly: false,
      forceFinish: false,
     }),
    ),
    options.guild.id,
    target.id,
   );

   return ban;
  }
  case 'tempChannelBanAdd':
  case 'channelBanAdd': {
   const opts = options as CT.ModOptions<'tempChannelBanAdd' | 'channelBanAdd'>;

   if (!opts.channel?.permissionOverwrites.cache.has(target.id)) {
    const permUpdate = await opts.channel?.permissionOverwrites
     .create(
      target.id,
      {},
      {
       reason: `${constants.standard.user(executor)} ${
        options.reason ? `| ${options.reason}` : ''
       }`,
       type: 1,
      },
     )
     .catch((err: Discord.DiscordAPIError) => err);

    if (permUpdate && !('id' in permUpdate)) return permUpdate;
   }

   const permUpdate = await opts.channel?.permissionOverwrites
    .edit(
     target.id,
     {
      SendMessages: false,
      Connect: false,
      ViewChannel: false,
      SendMessagesInThreads: false,
      AddReactions: false,
     },
     {
      reason: `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
      type: 1,
     },
    )
    .catch((err: Discord.DiscordAPIError) => err);

   if (type === 'tempChannelBanAdd') {
    cache.channelBans.set(
     Jobs.scheduleJob(
      new Date(Date.now() + (opts as CT.ModOptions<'tempChannelBanAdd'>).duration),
      () =>
       run(cmd, 'channelBanRemove', {
        target,
        guild: options.guild,
        channel: opts.channel,
        reason: readyLan.channelunban,
        forceFinish: true,
        dbOnly: false,
       }),
     ),
     options.guild.id,
     opts.channel?.id as string,
     target.id,
    );
   }

   return permUpdate;
  }
  case 'channelBanRemove': {
   const opts = options as CT.ModOptions<'channelBanRemove'>;

   const permUpdate = await opts.channel?.permissionOverwrites
    .edit(
     target.id,
     {
      SendMessages: null,
      Connect: null,
      ViewChannel: null,
      SendMessagesInThreads: null,
      AddReactions: null,
     },
     {
      reason: `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
      type: 1,
     },
    )
    .catch((err: Discord.DiscordAPIError) => err);

   if (permUpdate && !('id' in permUpdate)) return permUpdate;

   if (
    permUpdate?.permissionOverwrites.cache.get(target.id)?.deny.bitfield === 0n &&
    permUpdate?.permissionOverwrites.cache.get(target.id)?.allow.bitfield === 0n
   ) {
    return opts.channel?.permissionOverwrites
     .delete(
      target.id,
      `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
     )
     .catch((err: Discord.DiscordAPIError) => err);
   }

   return permUpdate;
  }
  case 'banRemove': {
   return options.guild.bans
    .remove(
     target.id,
     `${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`,
    )
    .catch((err: Discord.DiscordAPIError) => err);
  }
  case 'kickAdd': {
   return targetMember
    ?.kick(`${constants.standard.user(executor)} ${options.reason ? `| ${options.reason}` : ''}`)
    .catch((err: Discord.DiscordAPIError) => err);
  }
  case 'roleAdd': {
   const opts = options as CT.ModOptions<'roleAdd'>;
   return targetMember?.roles
    .add(opts.role.id, options.reason)
    .catch((err: Discord.DiscordAPIError) => err);
  }
  case 'roleRemove': {
   const opts = options as CT.ModOptions<'roleRemove'>;
   return targetMember?.roles
    .remove(opts.role.id, options.reason)
    .catch((err: Discord.DiscordAPIError) => err);
  }
  default: {
   throw new Error(`Invalid Mod Type ${type}`);
  }
 }
};

const doDM = async <T extends CT.ModTypes>(
 target: Discord.User,
 type: T,
 lan: CT.Language['mod']['execution'][T],
 options: CT.ModOptions<T>,
 language: CT.Language,
) => {
 const dm = await target.createDM().catch(() => undefined);
 if (!dm) return undefined;

 return send(dm, {
  embeds: [
   {
    color: constants.colors[constants.modColors[type]],
    timestamp: new Date().toISOString(),
    description: lan.dm(options as never),
    fields: options.reason ? [{ name: language.reason, value: options.reason }] : [],
   },
  ],
 });
};

const checkPunished = async <T extends CT.ModTypes>(
 targetMember: Discord.GuildMember | undefined | null,
 target: Discord.User,
 type: T,
 options: CT.ModOptions<T>,
) => {
 switch (type) {
  case 'muteRemove': {
   return !targetMember?.isCommunicationDisabled();
  }
  case 'tempMuteAdd': {
   return targetMember?.isCommunicationDisabled();
  }
  case 'banAdd':
  case 'softBanAdd':
  case 'tempBanAdd': {
   return options.guild?.bans.fetch(target.id).catch(() => null);
  }
  case 'channelBanAdd':
  case 'tempChannelBanAdd': {
   const opts = options as CT.ModOptions<'channelBanAdd' | 'tempChannelBanAdd'>;
   const perm = opts.channel?.permissionOverwrites.cache.get(target.id)?.deny;
   return (
    perm?.has(2048n) &&
    perm?.has(274877906944n) &&
    perm?.has(1024n) &&
    perm?.has(64n) &&
    perm?.has(1048576n)
   );
  }
  case 'channelBanRemove': {
   const opts = options as CT.ModOptions<'channelBanRemove'>;
   const perm = opts.channel?.permissionOverwrites.cache.get(target.id)?.deny;
   return (
    !perm?.has(2048n) ||
    !perm?.has(274877906944n) ||
    !perm?.has(1024n) ||
    !perm?.has(64n) ||
    !perm?.has(1048576n)
   );
  }
  case 'banRemove': {
   return !(await options.guild?.bans.fetch(target.id).catch(() => null));
  }
  case 'kickAdd': {
   return !options.guild?.members.cache.has(target.id);
  }
  case 'roleAdd': {
   const opts = options as CT.ModOptions<'roleAdd'>;
   return targetMember?.roles.cache.has(opts.role.id);
  }
  case 'roleRemove': {
   const opts = options as CT.ModOptions<'roleRemove'>;
   return !targetMember?.roles.cache.has(opts.role.id);
  }
  default: {
   return false;
  }
 }
};

const checkPunishable = <T extends CT.ModTypes>(
 targetMember: Discord.GuildMember | undefined | null,
 type: T,
 options: CT.ModOptions<T>,
) => {
 switch (type) {
  case 'muteRemove':
  case 'tempMuteAdd': {
   if (targetMember?.moderatable) return true;
   break;
  }
  case 'banAdd':
  case 'softBanAdd':
  case 'tempBanAdd': {
   if (targetMember?.bannable || (!targetMember && options.guild.members.me?.permissions.has(4n))) {
    return true;
   }
   break;
  }
  case 'channelBanAdd':
  case 'tempChannelBanAdd':
  case 'channelBanRemove': {
   const opts = options as CT.ModOptions<
    'channelBanRemove' | 'tempChannelBanAdd' | 'channelBanAdd'
   >;
   if (opts.channel?.manageable && targetMember) return true;
   break;
  }
  case 'banRemove': {
   if (options.guild.members.me?.permissions.has(4n)) return true;
   break;
  }
  case 'kickAdd': {
   if (targetMember?.kickable || (!targetMember && options.guild.members.me?.permissions.has(2n))) {
    return true;
   }
   break;
  }
  case 'roleRemove':
  case 'roleAdd': {
   const opts = options as CT.ModOptions<'roleAdd' | 'roleRemove'>;
   if (
    opts.role.rawPosition < Number(options.guild.members.me?.roles.highest.rawPosition) &&
    targetMember?.manageable
   ) {
    return true;
   }
   break;
  }
  default: {
   return true;
  }
 }
 return true;
};

const roleCheck = async <T extends CT.ModTypes>(
 targetMember: Discord.GuildMember | null | undefined,
 executorMember: Discord.GuildMember,
 options: CT.ModOptions<T>,
) => {
 if (!targetMember) return true;
 if (executorMember.user.id === options.guild.ownerId) return true;
 if (executorMember.roles.highest.position > targetMember.roles.highest.position) return true;
 return false;
};

const loadingEmbed = async (language: CT.Language, cmd: CmdType | undefined) => {
 const embed: Discord.APIEmbed = {
  color: constants.colors.loading,
  description: `${stringEmotes.loading} ${language.loading}...`,
 };

 if (!cmd?.channel) return undefined;

 if (cmd instanceof Discord.Message) return replyMsg(cmd, { embeds: [embed] });
 return replyCmd(cmd, { embeds: [embed] });
};

const error = (
 cmd: Discord.Message | Discord.ChatInputCommandInteraction,
 err: string,
 language: CT.Language,
 message?: Discord.Message | Discord.InteractionResponse,
) => {
 if (cmd instanceof Discord.Message) {
  return errorMsg(cmd, err, language, message as Discord.Message);
 }
 return errorCmd(cmd, err, language, message as Discord.Message);
};
