import * as Jobs from 'node-schedule';
import type * as Discord from 'discord.js';
import * as ch from '../BaseClient/ClientHelper.js';
import client from '../BaseClient/Client.js';
import type CT from '../Typings/CustomTypings';
import type DBT from '../Typings/DataBaseTypings';

export default async (args: CT.ModBaseEventOptions) => {
  const language = await ch.languageSelector(args.guild?.id);
  args.guild =
    args.guild ?? args.msg?.guild ?? args.m?.guild ?? args.channel?.guild ?? args.role?.guild;

  let action;
  let embed: Discord.APIEmbed = {};
  let error;
  let dm;

  if (!args.doDBonly && args.guild && language) {
    embed = loadingEmbed(language, args);

    if (args.msg && args.m && args.m.editable) {
      await args.m.edit({ embeds: [embed] }).catch(() => null);
    } else if (args.msg) args.m = await ch.replyMsg(args.msg, { embeds: [embed] });

    const targetMember = await args.guild.members.fetch(args.target.id).catch(() => undefined);
    const executingMember = args.executor
      ? await args.guild.members.fetch(args.executor.id).catch(() => undefined)
      : undefined;

    const roleCheckAllowed = await roleCheck(embed, language, targetMember, executingMember, args);
    if (!roleCheckAllowed) return;

    const selfPunish = await checkSelfPunish(embed, language, targetMember, executingMember, args);
    if (selfPunish) return;

    const mePunish = await checkMePunish(embed, language, targetMember, args);
    if (mePunish) return;

    const punishable = await checkPunishable(embed, language, targetMember, args);
    if (!punishable) return;

    const actionTaken = await checkActionTaken(embed, language, targetMember, args);
    if (actionTaken) return;

    dm = await doDM(language, targetMember, args);

    const actionReply = await takeAction(targetMember, args, language);

    ({ action, error } = actionReply);
  }

  if (action || args.doDBonly) {
    logEmbed(language, args);
    if (!args.doDBonly) {
      await declareSuccess(embed, language, args);
    }
  } else if (error) {
    await errorEmbed(embed, language, dm, error, args);
    return;
  }

  doDataBaseAction(args);

  if (args.source) client.emit('modSourceHandler', args.source, args.m, undefined, embed);
};

const declareSuccess = async (
  embed: Discord.APIEmbed,
  language: CT.Language,
  args: CT.ModBaseEventOptions,
) => {
  if (!args.msg) return;

  const lan = language.mod[args.type];

  if (args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${ch.stringEmotes.tick} ${lan.success(args)}`,
    });
  } else if (args.m) {
    embed.fields?.pop();
    embed.description = `${ch.stringEmotes.tick} ${lan.success(args)}`;
  } else {
    embed.description = `${ch.stringEmotes.tick} ${lan.success(args)}`;
  }

  if (args.m && args.m.editable) await args.m.edit({ embeds: [embed] }).catch(() => null);
};

const errorEmbed = async (
  embed: Discord.APIEmbed,
  language: CT.Language,
  dm: void | Discord.Message | null,
  err: string | true,
  args: CT.ModBaseEventOptions,
) => {
  if (!args.msg) return;
  if (dm) dm.delete().catch(() => null);

  const lan = language.mod[args.type];
  if (!('error' in lan)) {
    throw new Error(`Punishment of type ${args.type} has missing language values`);
  }

  if (args.m && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${ch.stringEmotes.cross} ${lan.error} ${ch.util.makeCodeBlock(String(err))}`,
    });
  } else if (args.m) {
    embed.fields?.pop();
    embed.description = `${ch.stringEmotes.cross} ${lan.error} ${ch.util.makeCodeBlock(
      String(err),
    )}`;
  } else {
    embed.description = `${ch.stringEmotes.cross} ${lan.error} ${ch.util.makeCodeBlock(
      String(err),
    )}`;
  }

  deleter(args);

  if (args.m && args.m.editable) await args.m.edit({ embeds: [embed] }).catch(() => null);
};

const logEmbed = async (language: CT.Language, args: CT.ModBaseEventOptions) => {
  const getLogchannels = async () =>
    ch
      .query(`SELECT modlogs FROM logchannels WHERE guildid = $1 AND modlogs IS NOT NULL;`, [
        args.guild?.id,
      ])
      .then((r: DBT.logchannels[] | null) => r?.[0]?.modlog || null);

  const lan = language.mod[args.type];
  const embed: Discord.APIEmbed = {
    color:
      ch.constants.colors[ch.constants.modColors[args.type] as keyof typeof ch.constants.colors],
    author: {
      name: lan.author(args),
      icon_url:
        (typeof args.target.avatarURL === 'function'
          ? args.target.avatarURL()
          : args.target.avatarURL) ?? undefined,
    },
    description: lan.description(args),
    timestamp: String(Date.now()),
    footer: {
      text: lan.footer(args),
    },
    fields: [],
  };

  if (args.reason) embed.fields?.push({ name: language.reason, value: `${args.reason}` });

  if (args.duration) {
    embed.fields?.push({
      name: language.duration,
      value: ch.moment(args.duration, language),
      inline: false,
    });
  }

  const logchannels = await getLogchannels();
  if (logchannels && logchannels.length && args.guild) {
    await ch.send({ id: logchannels, guildId: args.guild.id }, { embeds: [embed] });
  }
};

const loadingEmbed = (language: CT.Language, args: CT.ModBaseEventOptions) => {
  if (!args.msg) return {};

  const lan = language.mod[args.type];
  const embed = args.m?.embeds[0].data as Discord.APIEmbed;

  if (!embed.fields?.length) embed.fields = [];
  if (args.m || args.source) embed.fields?.pop();

  embed.color =
    ch.constants.colors[ch.constants.modColors[args.type] as keyof typeof ch.constants.colors];
  embed.fields?.push({ name: '\u200b', value: `${ch.stringEmotes.loading} ${lan.loading}` });

  return embed;
};

const roleCheck = async (
  embed: Discord.APIEmbed,
  language: CT.Language,
  targetMember: Discord.GuildMember | undefined,
  executingMember: Discord.GuildMember | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language?.mod[args.type];

  if (args.forceFinish) return true;
  if (
    !executingMember ||
    !targetMember ||
    executingMember.roles?.highest.position > targetMember?.roles?.highest.position ||
    args.executor?.id === args.guild?.ownerId
  ) {
    return true;
  }

  if (!args.msg && !args.msg) return false;

  if (args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${ch.stringEmotes.cross} ${lan.exeNoPerms}`,
    });

    deleter(args);
  } else if (args.m) {
    embed.fields?.pop();
    embed.description = `${ch.stringEmotes.cross} ${lan.exeNoPerms}`;

    deleter(args);
  } else {
    embed.description = `${ch.stringEmotes.cross} ${lan.exeNoPerms}`;

    deleter(args);
  }

  if (args.m && args.m.editable) await args.m.edit({ embeds: [embed] }).catch(() => null);
  return false;
};

const checkSelfPunish = async (
  embed: Discord.APIEmbed,
  language: CT.Language,
  targetMember: Discord.GuildMember | undefined,
  executingMember: Discord.GuildMember | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];

  if (args.forceFinish) return false;
  if (executingMember?.id !== targetMember?.id) return false;
  if (!args.msg && !args.msg) return true;

  if (args.source && args.m) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${ch.stringEmotes.cross} ${lan.selfPunish}`,
    });

    deleter(args);
  } else if (args.m) {
    embed.fields?.pop();
    embed.description = `${ch.stringEmotes.cross} ${lan.selfPunish}`;

    deleter(args);
  } else {
    embed.description = `${ch.stringEmotes.cross} ${lan.selfPunish}`;

    deleter(args);
  }

  if (args.m && args.m.editable) await args.m.edit({ embeds: [embed] }).catch(() => null);
  return true;
};

const checkMePunish = async (
  embed: Discord.APIEmbed,
  language: CT.Language,
  targetMember: Discord.GuildMember | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];

  if (args.forceFinish) return false;
  if (targetMember?.id !== client.user?.id) return false;
  if (!args.msg) return true;

  if (args.m && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${ch.stringEmotes.cross} ${lan.mePunish}`,
    });

    deleter(args);
  } else if (args.m) {
    embed.fields?.pop();
    embed.description = `${ch.stringEmotes.cross} ${lan.mePunish}`;

    deleter(args);
  } else {
    embed.description = `${ch.stringEmotes.cross} ${lan.mePunish}`;

    deleter(args);
  }

  if (args.m && args.m.editable) await args.m.edit({ embeds: [embed] }).catch(() => null);
  return true;
};

const checkPunishable = async (
  embed: Discord.APIEmbed,
  language: CT.Language,
  targetMember: Discord.GuildMember | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];

  switch (args.type) {
    case 'muteRemove':
    case 'tempmuteAdd': {
      if (targetMember?.moderatable) {
        return true;
      }
      break;
    }
    case 'banAdd':
    case 'softbanAdd':
    case 'tempbanAdd': {
      if (
        targetMember?.bannable ||
        (!targetMember && args.guild?.members.me?.permissions.has(4n))
      ) {
        return true;
      }
      break;
    }
    case 'channelbanAdd':
    case 'tempchannelbanAdd':
    case 'channelbanRemove': {
      if (args.channel?.manageable && targetMember) return true;
      break;
    }
    case 'banRemove': {
      if (args.guild?.members.me?.permissions.has(4n)) return true;
      break;
    }
    case 'kickAdd': {
      if (
        targetMember?.kickable ||
        (!targetMember && args.guild?.members.me?.permissions.has(2n))
      ) {
        return true;
      }
      break;
    }
    case 'roleAdd': {
      if (
        Number(args.role?.rawPosition) <
          Number(args.guild?.members.me?.roles?.highest.rawPosition) &&
        targetMember?.manageable
      ) {
        return true;
      }
      break;
    }
    case 'roleRemove': {
      if (
        Number(args.role?.rawPosition) <
          Number(args.guild?.members.me?.roles?.highest.rawPosition) &&
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

  if (args.forceFinish) return true;
  if (!args.msg) return false;
  if (!('permissionError' in lan)) {
    throw new Error(`Punishment of type ${args.type} has missing language values`);
  }

  if (args.m && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${ch.stringEmotes.cross} ${lan.permissionError}`,
    });

    deleter(args);
  } else if (args.m) {
    embed.fields?.pop();
    embed.description = `${ch.stringEmotes.cross} ${lan.permissionError}`;

    deleter(args);
  } else {
    embed.description = `${ch.stringEmotes.cross} ${lan.permissionError}`;

    deleter(args);
  }

  if (args.m && args.m.editable) await args.m.edit({ embeds: [embed] }).catch(() => null);
  return false;
};

const doDM = async (
  language: CT.Language,
  targetMember: Discord.GuildMember | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];
  const dmChannel = await targetMember?.createDM().catch(() => undefined);
  const DMembed: Discord.APIEmbed = {
    color:
      ch.constants.colors[ch.constants.modColors[args.type] as keyof typeof ch.constants.colors],
    timestamp: String(Date.now()),
    author: {
      name: lan.dm.author(args),
    },
  };

  if (args.reason) DMembed.description = `**${language.reason}:** \n${args.reason}`;

  return dmChannel ? ch.send(dmChannel, { embeds: [DMembed] }) : undefined;
};

const checkActionTaken = async (
  embed: Discord.APIEmbed,
  language: CT.Language,
  targetMember: Discord.GuildMember | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];
  let punished = false;

  switch (args.type) {
    case 'muteRemove': {
      punished = !targetMember?.isCommunicationDisabled();
      break;
    }
    case 'tempmuteAdd': {
      punished = !!targetMember?.isCommunicationDisabled();
      break;
    }
    case 'banAdd':
    case 'softbanAdd':
    case 'tempbanAdd': {
      punished = !!(await args.guild?.bans.fetch(args.target.id).catch(() => null));
      break;
    }
    case 'channelbanAdd':
    case 'tempchannelbanAdd': {
      punished = !!(
        args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(2048n) &&
        args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(274877906944n) &&
        args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(1024n) &&
        args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(64n) &&
        args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(1048576n)
      );
      break;
    }
    case 'channelbanRemove': {
      punished = !!(
        !args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(2048n) ||
        !args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(274877906944n) ||
        !args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(1024n) ||
        !args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(64n) ||
        !args.channel?.permissionOverwrites.cache.get(args.target.id)?.deny.has(1048576n)
      );
      break;
    }
    case 'banRemove': {
      punished = !(await args.guild?.bans.fetch(args.target.id).catch(() => undefined));
      break;
    }
    case 'kickAdd': {
      punished = !args.guild?.members.cache.has(args.target.id);
      break;
    }
    case 'roleAdd': {
      if (args.role) punished = !!targetMember?.roles.cache.has(args.role.id);
      break;
    }
    case 'roleRemove': {
      if (args.role) punished = !targetMember?.roles.cache.has(args.role.id);
      break;
    }
    default: {
      punished = false;
      break;
    }
  }

  if (args.forceFinish) return false;
  if (!punished) return false;
  if (!args.msg) return true;
  if (!('alreadyApplied' in lan)) {
    throw new Error(`Punishment of type ${args.type} has missing language values`);
  }
  if (args.m && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${ch.stringEmotes.cross} ${lan.alreadyApplied(args)}`,
    });

    deleter(args);
  } else if (args.m) {
    embed.fields?.pop();
    embed.description = `${ch.stringEmotes.cross} ${lan.alreadyApplied(args)}`;

    deleter(args);
  } else {
    embed.description = `${ch.stringEmotes.cross} ${lan.alreadyApplied(args)}`;

    deleter(args);
  }

  if (args.m && args.m.editable) await args.m.edit({ embeds: [embed] }).catch(() => undefined);
  return true;
};

const takeAction = async (
  targetMember: Discord.GuildMember | undefined,
  args: CT.ModBaseEventOptions,
  language: CT.Language,
) => {
  let punished;
  let error;

  switch (args.type) {
    case 'muteRemove': {
      punished = await targetMember
        ?.timeout(null, `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`)
        .catch((err) => {
          error = err;
        });
      break;
    }
    case 'tempmuteAdd': {
      punished = await targetMember
        ?.timeout(
          Number(args.duration),
          `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`,
        )
        .catch((err) => {
          error = err;
        });

      if (!args.guild) return { action: punished, error: language.errors.noGuildFound };

      ch.cache.mutes.set(
        Jobs.scheduleJob(new Date(Date.now() + Number(args.duration)), () => {
          client.emit('modBaseEvent', {
            target: args.target,
            reason: language.events.ready.unmute,
            executor: client.user,
            msg: args.msg,
            guild: args.guild,
            forceFinish: true,
            doDBonly: true,
            type: 'muteRemove',
          });
        }),
        args.guild.id,
        args.target.id,
      );

      break;
    }
    case 'banAdd': {
      let deleteMessageDays = 7;
      if (targetMember?.roles.cache.has('703694514035884162')) deleteMessageDays = 0;

      punished = await args.guild?.bans
        .create(args.target.id, {
          deleteMessageDays,
          reason: `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`,
        })
        .catch((err) => {
          error = err;
        });
      break;
    }
    case 'softbanAdd': {
      punished = await args.guild?.bans
        .create(args.target.id, {
          deleteMessageDays: 7,
          reason: `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`,
        })
        .catch((err) => {
          error = err;
        });

      if (punished) {
        punished = await args.guild?.bans
          .remove(args.target.id, `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`)
          .catch((err) => {
            error = err;
          });
      }

      break;
    }
    case 'tempbanAdd': {
      let deleteMessageDays = 7;
      if (targetMember?.roles.cache.has('703694514035884162')) deleteMessageDays = 0;

      punished = await args.guild?.bans
        .create(args.target.id, {
          deleteMessageDays,
          reason: `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`,
        })
        .catch((err) => {
          error = err;
        });

      if (!args.guild) return { action: punished, error: language.errors.noGuildFound };

      ch.cache.bans.set(
        Jobs.scheduleJob(new Date(Date.now() + Number(args.duration)), () => {
          client.emit('modBaseEvent', {
            target: args.target,
            reason: language.events.ready.unban,
            executor: client.user,
            msg: args.msg,
            guild: args.guild,
            forceFinish: true,
            type: 'banRemove',
          });
        }),
        args.guild.id,
        args.target.id,
      );

      break;
    }
    case 'tempchannelbanAdd':
    case 'channelbanAdd': {
      if (!args.channel?.permissionOverwrites.cache.has(args.target.id)) {
        punished = await args.channel?.permissionOverwrites
          .create(
            args.target.id,
            {},
            {
              reason: `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`,
              type: 1,
            },
          )
          .catch((err) => {
            error = err;
          });
      }

      if (!error) {
        punished = await args.channel?.permissionOverwrites
          .edit(
            args.target.id,
            {
              SendMessages: false,
              Connect: false,
              ViewChannel: false,
              SendMessagesInThreads: false,
              AddReactions: false,
            },
            {
              reason: `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`,
              type: 1,
            },
          )
          .catch((err) => {
            error = err;
          });
      }

      if (args.type === 'tempchannelbanAdd') {
        if (!args.guild) return { action: punished, error: language.errors.noGuildFound };
        if (!args.channel) return { action: punished, error: language.errors.noChannelFound };

        ch.cache.channelBans.set(
          Jobs.scheduleJob(
            `${args.channel?.id}-${args.target.id}`,
            new Date(Date.now() + Number(args.duration)),
            () => {
              client.emit('modBaseEvent', {
                target: args.target,
                reason: language.events.ready.channelunban,
                executor: client.user,
                msg: args.msg,
                guild: args.guild,
                channel: args.channel,
                forceFinish: true,
                type: 'channelbanRemove',
              });
            },
          ),
          args.guild?.id,
          args.channel?.id,
          args.target.id,
        );
      }
      break;
    }
    case 'channelbanRemove': {
      punished = await args.channel?.permissionOverwrites
        .edit(
          args.target.id,
          {
            SendMessages: null,
            Connect: null,
            ViewChannel: null,
            SendMessagesInThreads: null,
            AddReactions: null,
          },
          {
            reason: `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`,
            type: 1,
          },
        )
        .catch((err) => {
          error = err;
        });

      if (
        punished &&
        punished.permissionOverwrites.cache.get(args.target.id)?.deny.bitfield === 0n &&
        punished.permissionOverwrites.cache.get(args.target.id)?.allow.bitfield === 0n
      ) {
        punished = await args.channel?.permissionOverwrites
          .delete(args.target.id, `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`)
          .catch((err) => {
            error = err;
          });
      }
      break;
    }
    case 'banRemove': {
      punished = await args.guild?.bans
        .remove(args.target.id, `${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`)
        .catch((err) => {
          error = err;
        });
      break;
    }
    case 'kickAdd': {
      punished = await targetMember
        ?.kick(`${args.executor?.tag} ${args.reason ? `| ${args.reason}` : ''}`)
        .catch((err) => {
          error = err;
        });
      break;
    }
    case 'roleAdd': {
      punished = args.role
        ? targetMember?.roles.add(args.role.id).catch((err) => {
            error = err;
          })
        : (error = language.errors.noRoleFound);
      break;
    }
    case 'roleRemove': {
      punished = args.role
        ? targetMember?.roles.remove(args.role.id, 'mod event').catch((err) => {
            error = err;
          })
        : (error = language.errors.noRoleFound);
      break;
    }
    default: {
      return { action: true, error: false };
    }
  }

  return { action: punished, error };
};

const doDataBaseAction = async (args: CT.ModBaseEventOptions) => {
  const getAndDeleteRow = async (
    table: string,
    insertTable: string,
    extraSelectArgs: string[] | null,
    extraArgs: unknown[] | null,
    extraInsertArgNames: string[] | null,
    extraInsertArgs?: unknown[] | null,
  ) => {
    const selectArray = extraArgs
      ? [args.target.id, args.guild?.id, ...extraArgs]
      : [args.target.id, args.guild?.id];

    const res = await ch.query(
      `SELECT * FROM ${table} WHERE userid = $1 AND guildid = $2 ${
        extraSelectArgs
          ? `${extraSelectArgs.map((arg, i) => `AND ${arg} = $${i + 3}`).join('')}`
          : ''
      };`,
      selectArray as unknown as (string | number | boolean | null | undefined)[] | undefined,
    );

    if (res && res.length) {
      await ch.query(
        `DELETE FROM ${table} WHERE userid = $1 AND guildid = $2 AND uniquetimestamp = $3;`,
        [args.target.id, args.guild?.id, res[0].uniquetimestamp],
      ); // js

      const [row] = res;

      const insertArgs = extraInsertArgs
        ? [
            row.guildid,
            row.userid,
            row.reason,
            row.uniquetimestamp,
            row.channelid,
            row.channelname,
            row.executorid,
            row.executorname,
            row.msgid,
            ...extraInsertArgs,
          ]
        : [
            row.guildid,
            row.userid,
            row.reason,
            row.uniquetimestamp,
            row.channelid,
            row.channelname,
            row.executorid,
            row.executorname,
            row.msgid,
          ];

      if (
        !extraInsertArgs ||
        (extraInsertArgNames && extraInsertArgs.length < extraInsertArgNames.length)
      ) {
        const cloneArr = extraInsertArgNames?.slice();
        cloneArr?.splice(
          0,
          Math.abs(
            (extraInsertArgs ? extraInsertArgs.length : 0) -
              Number(extraInsertArgs ? extraInsertArgNames?.length : 0),
          ),
        );

        const mergeArr = cloneArr?.map((arg) => row[arg]) ?? [];

        insertArgs.push(...mergeArr);
      }

      await ch.query(
        `INSERT INTO ${insertTable} (guildid, userid, reason, uniquetimestamp, channelid, channelname, executorid, executorname, msgid${
          extraInsertArgNames ? `, ${extraInsertArgNames.join(', ')}` : ''
        }) VALUES
      (${insertArgs ? `${insertArgs.map((_, i) => `$${i + 1}`).join(', ')}` : ''});`,
        insertArgs,
      );
      return row;
    }
    return null;
  };

  const insertRow = (table: string, extraArgNames?: string[], extraArgs?: unknown[]) => {
    const insertArgs = extraArgs
      ? [
          args.guild?.id,
          args.target.id,
          args.reason,
          Date.now(),
          args.msg?.channel.id,
          args.msg && 'name' in args.msg.channel ? args.msg?.channel.name : '',
          args.executor?.id,
          args.executor?.tag,
          args.msg?.id,
          ...extraArgs,
        ]
      : [
          args.guild?.id,
          args.target.id,
          args.reason,
          Date.now(),
          args.msg?.channel.id,
          args.msg && 'name' in args.msg.channel ? args.msg?.channel.name : '',
          args.executor?.id,
          args.executor?.tag,
          args.msg?.id,
        ];

    ch.query(
      `INSERT INTO ${table} (guildid, userid, reason, uniquetimestamp, channelid, channelname, executorid, executorname, msgid${
        extraArgNames ? `, ${extraArgNames.join(', ')}` : '' // `
      }) VALUES (
        ${insertArgs ? `${insertArgs.map((_, i) => `$${i + 1}`).join(', ')}` : ''});`,
      insertArgs as unknown as (string | number | boolean | null | undefined)[] | undefined,
    );
  };

  switch (args.type) {
    case 'muteRemove': {
      getAndDeleteRow('punish_tempmutes', 'punish_mutes', null, null, ['duration']);
      break;
    }
    case 'tempmuteAdd': {
      insertRow('punish_tempmutes', ['duration'], [args.duration]);
      break;
    }
    case 'banAdd':
    case 'softbanAdd': {
      insertRow('punish_bans');
      break;
    }
    case 'tempbanAdd': {
      insertRow('punish_tempbans', ['duration'], [args.duration]);
      break;
    }
    case 'channelbanAdd': {
      insertRow('punish_channelbans', ['banchannelid'], [args.channel?.id]);
      break;
    }
    case 'tempchannelbanAdd': {
      insertRow(
        'punish_tempchannelbans',
        ['banchannelid', 'duration'],
        [args.channel?.id, args.duration],
      );
      break;
    }
    case 'channelbanRemove': {
      getAndDeleteRow(
        'punish_tempchannelbans',
        'punish_channelbans',
        ['banchannelid'],
        [args.channel?.id],
        ['banchannelid', 'duration'],
        [args.channel?.id],
      );
      break;
    }
    case 'banRemove': {
      getAndDeleteRow('punish_tempbans', 'punish_bans', null, null, ['duration']);
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

const deleter = (args: CT.ModBaseEventOptions) => {
  Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
    if (args.m && args.m.deletable) args.m.delete().catch(() => null);
    if (args.msg && args.msg.deletable) args.msg.delete().catch(() => null);
  });
};
