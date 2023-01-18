import jobs from 'node-schedule';
import DDeno from 'discordeno';
import Discord from 'discord.js';
import client from '../BaseClient/Client.js';
import type CT from '../Typings/CustomTypings';

export default async (args: CT.ModBaseEventOptions) => {
  const { executor, target, reason, msg, guild, type, source } = args;
  if (!guild) return;
  if (!executor) return;
  if (!target) return;

  const mExistedPreviously = !!args.m;
  const language = await client.ch.languageSelector(guild.id);

  let action;
  let embed: DDeno.Embed | undefined | null;
  let error;
  let dm;

  if (!args.doDBonly) {
    embed = loadingEmbed(mExistedPreviously, language, args);
    if (!embed) return;

    if (msg && mExistedPreviously && args.m) {
      await client.helpers
        .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
        .catch(() => null);
    } else if (msg) {
      const reply = await client.ch.replyMsg(msg, { embeds: [embed] });
      if (reply) args.m = reply;
    }

    const targetMember = await client.ch.cache.members.get(target.id, guild.id);
    const executingMember = await client.ch.cache.members.get(executor.id, guild.id);
    if (!executingMember) return;

    const roleCheckAllowed = await roleCheck(
      embed,
      mExistedPreviously,
      language,
      targetMember,
      executingMember,
      args,
    );
    if (!roleCheckAllowed) return;

    const selfPunish = await checkSelfPunish(
      embed,
      mExistedPreviously,
      language,
      targetMember,
      executingMember,
      args,
    );
    if (selfPunish) return;

    const mePunish = await checkMePunish(embed, mExistedPreviously, language, targetMember, args);
    if (mePunish) return;

    const punishable = await checkPunishable(
      embed,
      mExistedPreviously,
      language,
      targetMember,
      type,
      args,
    );
    if (!punishable) return;

    const actionTaken = await checkActionTaken(
      embed,
      mExistedPreviously,
      language,
      targetMember,
      args,
    );
    if (actionTaken) return;

    dm = await doDM(language, targetMember, reason, args);

    const actionReply = await takeAction(targetMember, args, language);

    ({ action, error } = actionReply);
  }

  if (action || args.doDBonly) {
    logEmbed(language, reason, args);
    if (!args.doDBonly) {
      await declareSuccess(embed, mExistedPreviously, language, args);
    }
  } else if (error) {
    await errorEmbed(embed, language, mExistedPreviously, dm, error, args);
    return;
  }

  doDataBaseAction(args);

  if (args.m && source) {
    (await import('./modSourceHandler.js')).default(
      source,
      args.m as CT.MessageGuild,
      undefined,
      embed || undefined,
    );
  }
};

const declareSuccess = async (
  embed: DDeno.Embed | undefined | null,
  mExistedPreviously: boolean,
  language: CT.Language,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];
  if (!args.msg) return;
  if (!embed) return;

  if (mExistedPreviously && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${client.stringEmotes.tick} ${lan.success(args)}`,
    });
  } else if (mExistedPreviously) {
    embed.fields?.pop();
    embed.description = `${client.stringEmotes.tick} ${lan.success(args)}`;
  } else {
    embed.description = `${client.stringEmotes.tick} ${lan.success(args)}`;
  }

  if (args.m) {
    await client.helpers
      .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
      .catch(() => null);
  }
};

const errorEmbed = async (
  embed: DDeno.Embed | undefined | null,
  language: CT.Language,
  mExistedPreviously: boolean,
  dm: void | DDeno.Message | null,
  err: boolean | undefined,
  args: CT.ModBaseEventOptions,
) => {
  if (!args.msg) return;
  if (dm) await client.helpers.deleteMessage(dm.channelId, dm.id).catch(() => null);
  if (!embed) return;

  if (mExistedPreviously && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${client.stringEmotes.cross} ${language.error} ${client.ch.util.makeCodeBlock(
        String(err),
      )}`,
    });

    deleter(args);
  } else if (mExistedPreviously) {
    embed.fields?.pop();
    embed.description = `${client.stringEmotes.cross} ${
      language.error
    } ${client.ch.util.makeCodeBlock(String(err))}`;

    deleter(args);
  } else {
    embed.description = `${client.stringEmotes.cross} ${
      language.error
    } ${client.ch.util.makeCodeBlock(String(err))}`;

    deleter(args);
  }

  if (args.m) {
    await client.helpers
      .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
      .catch(() => null);
  }
};

const logEmbed = async (language: CT.Language, reason: string, args: CT.ModBaseEventOptions) => {
  const lan = language.mod[args.type];
  const con = client.customConstants.mod[args.type];

  const embed: DDeno.Embed = {
    color: con.color,
    author: {
      name: lan.author(args),
      iconUrl: client.ch.getAvatarURL(args.target),
      url: client.customConstants.standard.invite,
    },
    description: lan.description(args),
    footer: {
      text: lan.footer(args),
    },
    fields: [],
  };

  if (reason) embed.fields?.push({ name: language.reason, value: `${reason}` });

  if (args.duration) {
    embed.fields?.push({
      name: language.duration,
      value: client.ch.moment(args.duration, language),
      inline: false,
    });
  }

  const logchannels = await client.ch.getLogChannels('modlogs', {
    guildId: (args.guild?.id ?? args.msg?.guildId ?? args.m?.guildId) as bigint,
  });

  if (logchannels && logchannels.length) {
    await client.ch.send(
      {
        id: logchannels,
        guildId: (args.guild?.id ?? args.msg?.guildId ?? args.m?.guildId) as bigint,
      },
      { embeds: [embed] },
      language,
      undefined,
      10000,
    );
  }
};

const loadingEmbed = (
  mExistedPreviously: boolean,
  language: CT.Language,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];
  const con = client.customConstants.mod[args.type];

  if (!args.msg) return null;

  if (mExistedPreviously && args.source) {
    const embed = args.m?.embeds[0];
    if (!embed) return null;

    embed.fields?.pop();
    embed.color = con.color;
    embed.fields?.push({
      name: '\u200b',
      value: `${client.stringEmotes.loading} ${lan.loading}`,
    });

    return embed;
  }
  if (mExistedPreviously) {
    const embed = args.m?.embeds[0];
    if (!embed) return null;

    embed.fields?.pop();
    embed.color = con.color;
    embed.description = `${client.stringEmotes.loading} ${lan.loading}`;

    return embed;
  }

  return {
    color: con.color,
    description: `${client.stringEmotes.loading} ${lan.loading}`,
  };
};

const roleCheck = async (
  embed: DDeno.Embed,
  mExistedPreviously: boolean,
  language: CT.Language,
  targetMember: DDeno.Member | null | undefined,
  executingMember: DDeno.Member,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];

  if (args.forceFinish) return true;
  if (
    !executingMember ||
    !targetMember ||
    (await client.ch.isManageable(targetMember, executingMember))
  ) {
    return true;
  }

  if (!args.msg) return false;
  if (!args.m) return false;

  if (mExistedPreviously && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${client.stringEmotes.cross} ${lan.exeNoPerms}`,
    });

    deleter(args);
  } else if (mExistedPreviously) {
    embed.fields?.pop();
    embed.description = `${client.stringEmotes.cross} ${lan.exeNoPerms}`;

    deleter(args);
  } else {
    embed.description = `${client.stringEmotes.cross} ${lan.exeNoPerms}`;

    deleter(args);
  }

  await client.helpers
    .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
    .catch(() => null);
  return false;
};

const checkSelfPunish = async (
  embed: DDeno.Embed,
  mExistedPreviously: boolean,
  language: CT.Language,
  targetMember: DDeno.Member | null | undefined,
  executingMember: DDeno.Member,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];

  if (args.forceFinish) return false;
  if (executingMember.id !== targetMember?.id) return false;
  if (!args.msg) return true;
  if (!args.m) return true;

  if (mExistedPreviously && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${client.stringEmotes.cross} ${lan.selfPunish}`,
    });

    deleter(args);
  } else if (mExistedPreviously) {
    embed.fields?.pop();
    embed.description = `${client.stringEmotes.cross} ${lan.selfPunish}`;

    deleter(args);
  } else {
    embed.description = `${client.stringEmotes.cross} ${lan.selfPunish}`;

    deleter(args);
  }

  if (mExistedPreviously && args.m) {
    await client.helpers
      .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
      .catch(() => null);
  }
  return true;
};

const checkMePunish = async (
  embed: DDeno.Embed,
  mExistedPreviously: boolean,
  language: CT.Language,
  targetMember: DDeno.Member | null | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];

  if (args.forceFinish) return false;
  if (targetMember?.id !== client.id) return false;
  if (!args.msg) return true;
  if (!args.m) return true;

  if (mExistedPreviously && args.source) {
    embed.fields?.pop();
    embed.fields?.push({
      name: '\u200b',
      value: `${client.stringEmotes.cross} ${lan.mePunish}`,
    });

    deleter(args);
  } else if (mExistedPreviously) {
    embed.fields?.pop();
    embed.description = `${client.stringEmotes.cross} ${lan.mePunish}`;

    deleter(args);
  } else {
    embed.description = `${client.stringEmotes.cross} ${lan.mePunish}`;

    deleter(args);
  }

  if (args.m) {
    await client.helpers
      .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
      .catch(() => null);
  }
  return true;
};

const checkPunishable = async (
  embed: DDeno.Embed,
  mExistedPreviously: boolean,
  language: CT.Language,
  targetMember: DDeno.Member | null | undefined,
  punishmentType: CT.ModBaseEventOptions['type'],
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];

  switch (punishmentType) {
    case 'muteRemove':
    case 'tempmuteAdd': {
      if (await isModeratable(targetMember)) {
        return true;
      }
      break;
    }
    case 'banAdd':
    case 'softbanAdd':
    case 'tempbanAdd': {
      if (await isBannable(targetMember)) {
        return true;
      }
      break;
    }
    case 'channelbanAdd':
    case 'tempchannelbanAdd':
    case 'channelbanRemove': {
      if (!args.channel) throw new Error('Channel Missing');
      if ((await isManageable(args.channel)) && targetMember) return true;
      break;
    }
    case 'banRemove': {
      if (await isBannable(targetMember)) return true;
      break;
    }
    case 'kickAdd': {
      if (await isKickable(targetMember)) return true;
      break;
    }
    case 'roleAdd': {
      if (
        args.guild &&
        (await client.ch.isManageable(
          targetMember,
          await client.ch.cache.members.get(client.id, args.guild.id),
        ))
      ) {
        return true;
      }
      break;
    }
    case 'roleRemove': {
      if (
        args.guild &&
        (await client.ch.isManageable(
          targetMember,
          await client.ch.cache.members.get(client.id, args.guild.id),
        ))
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

  if ('permissionError' in lan) {
    if (mExistedPreviously && args.source) {
      embed.fields?.pop();
      embed.fields?.push({
        name: '\u200b',
        value: `${client.stringEmotes.cross} ${lan.permissionError}`,
      });

      deleter(args);
    } else if (mExistedPreviously) {
      embed.fields?.pop();
      embed.description = `${client.stringEmotes.cross} ${lan.permissionError}`;

      deleter(args);
    } else {
      embed.description = `${client.stringEmotes.cross} ${lan.permissionError}`;

      deleter(args);
    }
  }

  if (args.m) {
    await client.helpers
      .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
      .catch(() => null);
  }
  return false;
};

const doDM = async (
  language: CT.Language,
  targetMember: DDeno.Member | undefined | null,
  reason: string,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];
  const con = client.customConstants.mod[args.type];

  const dmChannel = targetMember
    ? await client.helpers.getDmChannel(targetMember.id).catch(() => null)
    : null;
  const DMembed: DDeno.Embed = {
    color: con.color,
    author: {
      name: lan.dm.author(args),
      url: `https://discord.com/users/${args.target.id}`,
    },
  };

  if (reason) DMembed.description = `**${language.reason}:** \n${reason}`;

  if (!dmChannel) return null;
  const m = await client.ch.send(dmChannel, { embeds: [DMembed] }, language);

  return m;
};

const checkActionTaken = async (
  embed: DDeno.Embed,
  mExistedPreviously: boolean,
  language: CT.Language,
  targetMember: DDeno.Member | null | undefined,
  args: CT.ModBaseEventOptions,
) => {
  const lan = language.mod[args.type];
  let punished = false;

  switch (args.type) {
    case 'muteRemove': {
      punished = !(Number(targetMember?.communicationDisabledUntil) > Date.now());
      break;
    }
    case 'tempmuteAdd': {
      punished = Number(targetMember?.communicationDisabledUntil) > Date.now();
      break;
    }
    case 'banAdd':
    case 'softbanAdd':
    case 'tempbanAdd': {
      punished = args.guild
        ? !!(await client.helpers.getBan(args.guild.id, args.target.id).catch(() => null))
        : false;
      break;
    }
    case 'channelbanAdd':
    case 'tempchannelbanAdd': {
      if (!args.channel) return false;
      const permission = client.ch.getPermission(args.target.id, args.channel);
      if (permission) {
        const deny = new Discord.PermissionsBitField(permission.deny);

        punished =
          deny.has(2048n) &&
          deny.has(274877906944n) &&
          deny.has(1024n) &&
          deny.has(64n) &&
          deny.has(1048576n);
      }

      break;
    }
    case 'channelbanRemove': {
      if (!args.channel) return false;

      const permission = client.ch.getPermission(args.target.id, args.channel);
      if (permission) {
        const deny = new Discord.PermissionsBitField(permission.deny);

        punished =
          !deny.has(2048n) &&
          !deny.has(274877906944n) &&
          !deny.has(1024n) &&
          !deny.has(64n) &&
          !deny.has(1048576n);
      }
      break;
    }
    case 'banRemove': {
      punished = args.guild
        ? !(await client.helpers.getBan(args.guild.id, args.target.id).catch(() => null))
        : true;
      break;
    }
    case 'kickAdd': {
      punished = args.guild
        ? !(await client.ch.cache.members.get(args.target.id, args.guild.id))
        : false;
      break;
    }
    case 'roleAdd': {
      if (!args.role) throw new Error('No Role provided');
      punished = !!targetMember?.roles.includes(args.role.id);
      break;
    }
    case 'roleRemove': {
      if (!args.role) throw new Error('No Role provided');
      punished = !targetMember?.roles.includes(args.role.id);
      break;
    }
    default: {
      punished = false;
      break;
    }
  }

  if (args.forceFinish) return false;

  if (punished && 'alreadyApplied' in lan) {
    if (!args.msg) return true;

    if (mExistedPreviously && args.source) {
      embed.fields?.pop();
      embed.fields?.push({
        name: '\u200b',
        value: `${client.stringEmotes.cross} ${lan.alreadyApplied(args)}`,
      });

      deleter(args);
    } else if (mExistedPreviously) {
      embed.fields?.pop();
      embed.description = `${client.stringEmotes.cross} ${lan.alreadyApplied(args)}`;

      deleter(args);
    } else {
      embed.description = `${client.stringEmotes.cross} ${lan.alreadyApplied(args)}`;

      deleter(args);
    }

    if (args.m) {
      await client.helpers
        .editMessage(args.m.channelId, args.m.id, { embeds: [embed] })
        .catch(() => null);
    }
    return true;
  }

  return false;
};

const takeAction = async (
  targetMember: DDeno.Member | null | undefined,
  args: CT.ModBaseEventOptions,
  language: CT.Language,
) => {
  let punished;
  let error;

  switch (args.type) {
    case 'muteRemove': {
      punished =
        args.guild && targetMember
          ? await client.helpers
              .editMember(args.guild.id, targetMember.id, { communicationDisabledUntil: 0 })
              .catch((err) => {
                error = err;
              })
          : false;

      break;
    }
    case 'tempmuteAdd': {
      if (!args.duration) throw new Error('No Duration provided');

      punished =
        args.guild && targetMember
          ? await client.helpers
              .editMember(args.guild.id, targetMember.id, {
                communicationDisabledUntil: args.duration,
              })
              .catch((err) => {
                error = err;
              })
          : false;

      if (args.guild?.id) {
        client.ch.cache.mutes.set(
          jobs.scheduleJob(
            `${args.guild?.id}-${args.target.id}`,
            new Date(Date.now() + args.duration),
            async () => {
              const options: CT.ModBaseEventOptions = {
                target: args.target,
                reason: language.events.ready.unmute,
                executor: await client.ch.cache.users.get(client.id),
                msg: args.msg,
                guild: args.guild,
                forceFinish: true,
                doDBonly: true,
                type: 'muteRemove',
              };

              if (args.guild) {
                client.ch.cache.mutes.delete(args.guild?.id, args.target.id);
              }

              // eslint-disable-next-line import/no-self-import
              (await import('./modBaseEvent.js')).default(options);
            },
          ),
          args.guild.id,
          args.target.id,
        );
      }
      break;
    }
    case 'banAdd': {
      punished =
        args.guild && targetMember
          ? client.helpers
              .banMember(args.guild.id, targetMember.id, {
                deleteMessageSeconds: 604800,
                reason: `${args.executor?.username}#${args.executor?.discriminator} ${
                  args.reason ? `| ${args.reason}` : ''
                }`,
              })
              .catch((err) => {
                error = err;
              })
          : false;

      break;
    }
    case 'softbanAdd': {
      punished =
        args.guild && targetMember
          ? client.helpers
              .banMember(args.guild.id, targetMember.id, {
                deleteMessageSeconds: 604800,
                reason: `${args.executor?.username}#${args.executor?.discriminator} ${
                  args.reason ? `| ${args.reason}` : ''
                }`,
              })
              .catch((err) => {
                error = err;
              })
          : false;

      if (!error) {
        punished =
          args.guild && targetMember
            ? client.helpers.unbanMember(args.guild.id, targetMember.id).catch((err) => {
                error = err;
              })
            : false;
      }

      break;
    }
    case 'tempbanAdd': {
      punished =
        args.guild && targetMember
          ? client.helpers
              .banMember(args.guild.id, targetMember.id, {
                deleteMessageSeconds: 604800,
                reason: `${args.executor?.username}#${args.executor?.discriminator} ${
                  args.reason ? `| ${args.reason}` : ''
                }`,
              })
              .catch((err) => {
                error = err;
              })
          : false;

      if (args.guild?.id) {
        client.ch.cache.bans.set(
          jobs.scheduleJob(
            `${args.guild?.id}-${args.target.id}`,
            new Date(Date.now() + Number(args.duration)),
            async () => {
              const options: CT.ModBaseEventOptions = {
                target: args.target,
                reason: language.events.ready.unban,
                executor: await client.ch.cache.users.get(client.id),
                msg: args.msg,
                guild: args.guild,
                forceFinish: true,
                type: 'banRemove',
              };

              if (args.guild) {
                client.ch.cache.bans.delete(args.guild.id, args.target.id);
              }

              // eslint-disable-next-line import/no-self-import
              (await import('./modBaseEvent.js')).default(options);
            },
          ),
          args.guild.id,
          args.target.id,
        );
      }
      break;
    }
    case 'tempchannelbanAdd':
    case 'channelbanAdd': {
      if (!args.channel) return { action: false, error: true };

      const permission = client.ch.getPermission(args.target.id, args.channel);
      const allowPerms = permission?.allow
        ? new Discord.PermissionsBitField(permission.allow)
        : new Discord.PermissionsBitField(0n);

      if (allowPerms) {
        allowPerms.remove(2048n);
        allowPerms.remove(274877906944n);
        allowPerms.remove(1024n);
        allowPerms.remove(64n);
        allowPerms.remove(1048576n);

        punished = args.channel
          ? await client.helpers
              .editChannelPermissionOverrides(args.channel.id, {
                id: args.target.id,
                type: 1,
                allow: DDeno.calculatePermissions(allowPerms.bitfield),
                deny: DDeno.calculatePermissions(274878958656n),
                reason: `${args.executor?.username}#${args.executor?.discriminator} ${
                  args.reason ? `| ${args.reason}` : ''
                }`,
              })
              .catch((err) => {
                error = err;
              })
          : false;
      }

      if (args.type === 'tempchannelbanAdd') {
        if (args.guild?.id) {
          client.ch.cache.channelBans.set(
            jobs.scheduleJob(
              `${args.channel?.id}-${args.target.id}`,
              new Date(Date.now() + Number(args.duration)),
              async () => {
                const options: CT.ModBaseEventOptions = {
                  target: args.target,
                  reason: language.events.ready.channelunban,
                  executor: await client.ch.cache.users.get(client.id),
                  msg: args.msg,
                  guild: args.guild,
                  channel: args.channel,
                  forceFinish: true,
                  type: 'channelbanRemove',
                };

                if (args.guild && args.channel) {
                  client.ch.cache.channelBans.cache
                    .get(args.guild?.id)
                    ?.get(args.channel?.id)
                    ?.get(args.target.id)
                    ?.cancel();
                  const cache = client.ch.cache.channelBans.cache.get(args.guild?.id);

                  if (cache?.size === 1) {
                    client.ch.cache.channelBans.delete(
                      args.guild.id,
                      args.channel?.id,
                      args.target.id,
                    );
                  } else cache?.delete(args.target.id);
                }

                // eslint-disable-next-line import/no-self-import
                (await import('./modBaseEvent.js')).default(options);
              },
            ),
            args.guild.id,
            args.channel.id,
            args.target.id,
          );
        }
      }
      break;
    }
    case 'channelbanRemove': {
      if (!args.channel) return { action: false, error: true };

      const permission = client.ch.getPermission(args.target.id, args.channel);
      const denyPerms = permission?.deny
        ? new Discord.PermissionsBitField(permission.deny)
        : new Discord.PermissionsBitField(0n);

      if (denyPerms) {
        denyPerms.remove(2048n);
        denyPerms.remove(274877906944n);
        denyPerms.remove(1024n);
        denyPerms.remove(64n);
        denyPerms.remove(1048576n);
      }

      punished = args.channel
        ? await client.helpers
            .editChannelPermissionOverrides(args.channel.id, {
              id: args.target.id,
              type: 1,
              allow: permission?.allow
                ? (new Discord.PermissionsBitField(permission?.allow)
                    .toArray()
                    .map((s) =>
                      s.replace(/[A-Z]/g, (l) => `_${l}`).toUpperCase(),
                    ) as DDeno.PermissionStrings[])
                : [],
              deny: DDeno.calculatePermissions(denyPerms.bitfield),
              reason: `${args.executor?.username}#${args.executor?.discriminator} ${
                args.reason ? `| ${args.reason}` : ''
              }`,
            })
            .catch((err) => {
              error = err;
            })
        : false;

      if (permission && permission.deny === 0n && permission.allow === 0n) {
        punished = await client.helpers
          .deleteChannelPermissionOverride(
            args.channel.id,
            args.target.id,
            `${args.executor?.username}#${args.executor?.discriminator} ${
              args.reason ? `| ${args.reason}` : ''
            }`,
          )
          .catch((err) => {
            error = err;
          });
      }
      break;
    }
    case 'banRemove': {
      if (!args.guild) return { action: false, error: true };

      punished = await client.helpers.unbanMember(args.guild.id, args.target.id).catch((err) => {
        error = err;
      });
      break;
    }
    case 'kickAdd': {
      if (!args.guild) return { action: false, error: true };

      if (targetMember) {
        punished = await client.helpers
          .kickMember(
            args.guild.id,
            targetMember.id,
            `${args.executor?.username}#${args.executor?.discriminator} ${
              args.reason ? `| ${args.reason}` : ''
            }`,
          )
          .catch((err) => {
            error = err;
          });
      }
      break;
    }
    case 'roleAdd': {
      if (!targetMember) throw new Error('No Member provided');
      if (!args.role) throw new Error('No Role provided');

      punished = client.ch.roleManager
        .add(
          targetMember,
          [args.role.id],
          `${args.executor?.username}#${args.executor?.discriminator} ${
            args.reason ? `| ${args.reason}` : ''
          }`,
        )
        .catch((err) => {
          error = err;
        });
      break;
    }
    case 'roleRemove': {
      if (!targetMember) throw new Error('No Member provided');
      if (!args.role) throw new Error('No Role provided');

      punished = client.ch.roleManager
        .remove(
          targetMember,
          [args.role.id],
          `${args.executor?.username}#${args.executor?.discriminator} ${
            args.reason ? `| ${args.reason}` : ''
          }`,
        )
        .catch((err) => {
          error = err;
        });
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
    extraArgs: string[] | null,
    extraInsertArgNames: string[],
    extraInsertArgs?: string[],
  ) => {
    const selectArray = extraArgs
      ? [args.target.id, args.guild?.id, ...extraArgs]
      : [args.target.id, args.guild?.id];

    const rows = await client.ch.query(
      `SELECT * FROM ${table} WHERE userid = $1 AND guildid = $2 ${
        extraSelectArgs
          ? `${extraSelectArgs.map((arg, i) => `AND ${arg} = $${i + 3}`).join('')}`
          : ''
      };`,
      selectArray as unknown as (
        | string
        | number
        | boolean
        | null
        | undefined
        | (string | number | boolean | null | undefined)[]
      )[],
    );

    if (rows?.length) {
      await client.ch.query(
        `DELETE FROM ${table} WHERE userid = $1 AND guildid = $2 AND uniquetimestamp = $3;`,
        [args.target.id, args.guild?.id, rows[0].uniquetimestamp],
      );

      const [row] = rows;

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
        const cloneArr = extraInsertArgNames.slice();
        cloneArr.splice(
          0,
          Math.abs(
            (extraInsertArgs ? extraInsertArgs.length : 0) -
              (extraInsertArgs ? extraInsertArgNames.length : 0),
          ),
        );

        const mergeArr = cloneArr.map((arg) => row[arg]);

        insertArgs.push(...mergeArr);
      }

      await client.ch.query(
        `INSERT INTO ${insertTable} (guildid, userid, reason, uniquetimestamp, channelid, channelname, executorid, executorname, msgid${
          extraInsertArgNames ? `, ${extraInsertArgNames.join(', ')}` : ''
        }) VALUES
      (${insertArgs ? `${insertArgs.map((_arg, i) => `$${i + 1}`).join(', ')}` : ''});`,
        insertArgs,
      ); // js
      return row;
    }
    return null;
  };

  const insertRow = async (table: string, extraArgNames?: string[], extraArgs?: string[]) => {
    const insertArgs = extraArgs
      ? [
          args.guild?.id,
          args.target.id,
          args.reason,
          Date.now(),
          args.msg?.channelId,
          args.msg && args.guild
            ? await client.ch.cache.channels.get(args.msg?.channelId, args.guild?.id)
            : '-',
          args.executor?.id,
          `${args.executor?.username}#${args.executor?.discriminator}`,
          args.msg?.id,
          ...extraArgs,
        ]
      : [
          args.guild?.id,
          args.target.id,
          args.reason,
          Date.now(),
          args.msg?.channelId,
          args.msg && args.guild
            ? await client.ch.cache.channels.get(args.msg?.channelId, args.guild?.id)
            : '-',
          args.executor?.id,
          `${args.executor?.username}#${args.executor?.discriminator}`,
          args.msg?.id,
        ];

    client.ch.query(
      `INSERT INTO ${table} (guildid, userid, reason, uniquetimestamp, channelid, channelname, executorid, executorname, msgid${
        extraArgNames ? `, ${extraArgNames.join(', ')}` : '' // `
      }) VALUES (
        ${insertArgs ? `${insertArgs.map((_arg, i) => `$${i + 1}`).join(', ')}` : ''});`,
      insertArgs as (
        | string
        | number
        | boolean
        | (string | number | boolean | null | undefined)[]
      )[],
    ); // js
  };

  switch (args.type) {
    case 'muteRemove': {
      getAndDeleteRow('punish_tempmutes', 'punish_mutes', null, null, ['duration']);
      break;
    }
    case 'tempmuteAdd': {
      insertRow('punish_tempmutes', ['duration'], [String(args.duration)]);
      break;
    }
    case 'banAdd':
    case 'softbanAdd': {
      insertRow('punish_bans');
      break;
    }
    case 'tempbanAdd': {
      insertRow('punish_tempbans', ['duration'], [String(args.duration)]);
      break;
    }
    case 'channelbanAdd': {
      insertRow('punish_channelbans', ['banchannelid'], [String(args.channel?.id)]);
      break;
    }
    case 'tempchannelbanAdd': {
      insertRow(
        'punish_tempchannelbans',
        ['banchannelid', 'duration'],
        [String(args.channel?.id), String(args.duration)],
      );
      break;
    }
    case 'channelbanRemove': {
      getAndDeleteRow(
        'punish_tempchannelbans',
        'punish_channelbans',
        ['banchannelid'],
        [String(args.channel?.id)],
        ['banchannelid', 'duration'],
        [String(args.channel?.id)],
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
  jobs.scheduleJob(new Date(Date.now() + 10000), () => {
    if (args.m) {
      client.helpers.deleteMessage(args.m.channelId, args.m.id).catch(() => null);
    }
    if (args.msg) {
      client.helpers.deleteMessage(args.msg.channelId, args.msg.id).catch(() => null);
    }
  });
};

const isModeratable = async (m: DDeno.Member | undefined | null) =>
  !m ||
  ((await client.ch.hasGuildPermissions(m.guildId, m.id, ['Administrator'])) &&
    (await client.ch.isManageable(m, await client.ch.cache.members.get(m.guildId, m.id))) &&
    client.ch.hasGuildPermissions(m.guildId, m.id, ['ModerateMembers']));

const isBannable = async (m: DDeno.Member | undefined | null) =>
  !m ||
  ((await client.ch.isManageable(m, await client.ch.cache.members.get(m.guildId, m.id))) &&
    client.ch.hasGuildPermissions(m.guildId, m.id, ['BanMembers']));

const isManageable = async (c: DDeno.Channel) => {
  if (await client.ch.hasGuildPermissions(c.guildId, client.me.id, ['Administrator'])) {
    return true;
  }

  return (
    client.ch.hasGuildPermissions(c.id, client.me.id, ['ViewChannel', 'Connect']) ||
    client.ch.hasGuildPermissions(c.id, client.me.id, ['ViewChannel', 'SendMessages'])
  );
};

const isKickable = async (m: DDeno.Member | null | undefined) =>
  m &&
  (await client.ch.isManageable(m, await client.ch.cache.members.get(m.guildId, m.id))) &&
  client.ch.hasGuildPermissions(m.guildId, m.id, ['KickMembers']);
