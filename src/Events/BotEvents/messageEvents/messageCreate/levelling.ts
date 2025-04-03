import Prisma, { LevelType, type leveling } from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as StringSimilarity from 'string-similarity';
import ChannelRules from '../../../../BaseClient/Other/ChannelRules.js';
import * as CT from '../../../../Typings/Typings.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

type LevelData = { oldXP: number; newXP: number; newLevel: number; oldLevel: number };

export default async (msg: Discord.Message<true>) => {
 if (msg.author.bot) return;

 globalLevelling(msg);
 levelling(msg);
};

const globalLevelling = async (msg: Discord.Message<true>) => {
 if (msg.client.util.cache.globalLevellingCD.has(msg.author.id)) return;

 const lastMessage = msg.client.util.cache.lastMessageGlobal.get(msg.author.id);
 if (lastMessage && StringSimilarity.compareTwoStrings(msg.content, lastMessage) > 0.9) return;
 msg.client.util.cache.lastMessageGlobal.set(msg.author.id, msg.content);

 msg.client.util.cache.globalLevellingCD.add(msg.author.id);

 Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 60000), () => {
  msg.client.util.cache.globalLevellingCD.delete(msg.author.id);
 });

 const level = await msg.client.util.DataBase.level.findFirst({
  where: { type: 'global', userid: msg.author.id },
 });

 if (level) updateLevels(msg, null, level, 10, 'global', [1]);
 else insertLevels(msg, 'global', 10, [1]);
};

const levelling = async (msg: Discord.Message<true>) => {
 await checkLevelRoles(msg);
 if (msg.client.util.cache.guildLevellingCD.has(msg.author.id)) return;

 const lastMessage = msg.client.util.cache.lastMessageGuild.get(msg.author.id);
 if (lastMessage && StringSimilarity.compareTwoStrings(msg.content, lastMessage) > 0.9) return;
 msg.client.util.cache.lastMessageGuild.set(msg.author.id, msg.content);
 msg.client.util.cache.guildLevellingCD.add(msg.author.id);

 Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 60000), () => {
  msg.client.util.cache.guildLevellingCD.delete(msg.author.id);
 });

 const settings = await checkEnabled(msg);
 if (settings && (!settings.active || !settings.textenabled)) return;

 if (
  !(await getRules(msg)) &&
  Number(msg.content.match(/\s+/g)?.length) < Number(settings?.minwords)
 ) {
  return;
 }

 if (
  settings?.ignoreprefixes &&
  settings?.prefixes.length &&
  settings.prefixes.some((w) => msg.content.toLowerCase().startsWith(w.toLowerCase()))
 ) {
  return;
 }

 const isUserWhitelisted = settings?.wluserid?.includes(msg.author.id);
 const isRoleWhitelisted = settings?.wlroleid?.length
  ? msg.member?.roles.cache.some((r) => settings.wlroleid.includes(r.id))
  : false;
 const isChannelWhitelisted = settings?.wlchannelid?.length
  ? settings.wlchannelid.includes(msg.channel.id)
  : false;

 if (!isUserWhitelisted && !isRoleWhitelisted && !isChannelWhitelisted) {
  const isUserBlacklisted = settings?.bluserid?.includes(msg.author.id);
  const isRoleBlacklisted = settings?.blroleid
   ? msg.member?.roles.cache.some((r) => settings.blroleid.includes(r.id))
   : false;
  const isChannelBlacklisted = settings?.blchannelid?.includes(msg.channel.id);

  if (isUserBlacklisted || isRoleBlacklisted || isChannelBlacklisted) return;
 }

 const rules = await getRules(msg);
 if (rules.length && !checkRules(msg, rules)) return;

 const level = await msg.client.util.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: msg.author.id, guildid: msg.guildId, type: 'guild' } },
 });

 const rewardroles = await msg.client.util.DataBase.rolerewards.findMany({
  where: { guildid: msg.guildId, active: true, xpmultiplier: { not: 1 } },
 });

 const rewardXPMult = rewardroles.map((r) => Number(r.xpmultiplier)).reduce((a, b) => a + b, 0);
 const baseXP = settings ? Number(settings.xppermsg) - 10 : 15;

 if (level) {
  updateLevels(msg, settings, level, baseXP < 0 ? 1 : baseXP, 'guild', [
   settings ? Number(settings.xpmultiplier) + rewardXPMult : 1,
  ]);

  return;
 }

 insertLevels(msg, 'guild', baseXP < 0 ? 1 : baseXP, [
  settings ? Number(settings.xpmultiplier) : 1,
 ]);
};

const getRules = async (msg: Discord.Message<true>) => {
 const settings = await msg.client.util.DataBase.levelingruleschannels.findMany({
  where: { guildid: msg.guildId },
 });

 if (!settings.length) return [];
 return settings.filter((s) => s.channels.includes(msg.channel.id));
};

const checkEnabled = async (msg: Discord.Message<true>) =>
 msg.client.util.DataBase.leveling.findUnique({
  where: { guildid: msg.guildId },
 });

const updateLevels = async (
 msg: Discord.Message<true>,
 settings: Prisma.leveling | null,
 level: Prisma.level,
 baseXP: number,
 type: LevelType,
 xpMultiplier = [1],
) => {
 if (settings) {
  xpMultiplier.push(await getRoleMultiplier(msg));
  xpMultiplier.push(await getChannelMultiplier(msg));
 }

 const newXP = Math.floor(
  (xpMultiplier.length ? xpMultiplier : [1])
   .map((m) => Math.floor(msg.client.util.getRandom(baseXP, baseXP + 10)) * m)
   .reduce((a, b) => a + b) / xpMultiplier.length || 1,
 );

 const oldLevel = Number(level.level);
 const xp = newXP + Number(level.xp) < 1 ? 1 : newXP + Number(level.xp);
 const neededXP =
  (5 / 6) * (oldLevel + 1) * (2 * (oldLevel + 1) * (oldLevel + 1) + 27 * (oldLevel + 1) + 91);

 let newLevel = oldLevel;

 if (xp >= neededXP) {
  newLevel += 1;

  if (level) {
   levelUp(
    { oldXP: Number(level.xp), newXP: xp, newLevel: oldLevel + 1, oldLevel },
    settings as Prisma.leveling,
    await msg.client.util.request.guilds.getMember(msg.guild, msg.author.id, msg.guild),
    msg,
   );
  }
 }

 if (type === 'guild') {
  msg.client.util.DataBase.level
   .update({
    where: { userid_guildid_type: { type, userid: msg.author.id, guildid: msg.guildId } },
    data: { level: newLevel, xp },
   })
   .then();

  msg.client.util.DataBase.levelchannels
   .upsert({
    where: {
     userid_guildid_channelid: {
      userid: msg.author.id,
      guildid: msg.guildId,
      channelid: msg.channelId,
     },
    },
    update: { xp: { increment: newXP } },
    create: {
     xp: newXP,
     userid: msg.author.id,
     guildid: msg.guildId,
     channelid: msg.channelId,
    },
   })
   .then();
  return;
 }

 msg.client.util.DataBase.level
  .update({
   where: { userid_guildid_type: { type, userid: msg.author.id, guildid: '1' } },
   data: {
    level: newLevel,
    xp,
    type,
    userid: msg.author.id,
   },
  })
  .then();
};

const insertLevels = (
 msg: Discord.Message<true>,
 type: LevelType,
 baseXP: number,
 xpMultiplier: number[] = [],
) => {
 const xp = Math.floor(
  (xpMultiplier.length ? xpMultiplier : [1])
   .map((m) => Math.floor(msg.client.util.getRandom(baseXP, baseXP + 10)) * m)
   .reduce((a, b) => a + b) / xpMultiplier.length || 1,
 );

 msg.client.util.DataBase.level
  .create({
   data: {
    type,
    userid: msg.author.id,
    xp,
    level: 0,
    guildid: type === 'global' ? '1' : msg.guildId,
   },
  })
  .then();

 if (type !== 'global') {
  msg.client.util.DataBase.levelchannels
   .create({
    data: {
     guildid: msg.guildId,
     xp,
     userid: msg.author.id,
     channelid: msg.channelId,
    },
   })
   .then();
 }
};

const getRoleMultiplier = async (msg: Discord.Message<true>) => {
 if (!msg.guildId) return 1;

 const mps = await msg.client.util.DataBase.levelingmultiroles.findMany({
  where: { guildid: msg.guildId },
 });
 if (!mps.length) return 1;

 const mp = mps.filter((r) => msg.member?.roles.cache.some((r2) => r.roles.includes(r2.id)));
 return mp.length ? mp.reduce((a, b) => a + Number(b.multiplier), 0) / mp.length : 1;
};

const getChannelMultiplier = async (msg: Discord.Message<true>) => {
 if (!msg.guildId) return 1;

 const mps = await msg.client.util.DataBase.levelingmultichannels.findMany({
  where: { guildid: msg.guildId },
 });
 if (!mps.length) return 1;

 const mp = mps.filter((r) => r.channels.includes(msg.channel.id));
 return mp.length ? mp.reduce((a, b) => a + Number(b.multiplier), 0) / mp.length : 1;
};

const checkRules = (msg: Discord.Message<true>, settings: Prisma.levelingruleschannels[]) => {
 const passes = settings.map((s) => {
  const rules = new ChannelRules(s).toArray();
  if (!rules.length) return true;

  const appliedRules: Partial<{ [key in (typeof rules)[number]]: number }> = {};

  rules.forEach((uppercaseKey) => {
   const key = uppercaseKey.toLowerCase() as keyof typeof appliedRules;
   appliedRules[key] = Number(settings[key as keyof typeof settings]);
  });

  const willLevel: boolean[] = [];

  Object.entries(appliedRules).forEach(([key, num]) => {
   switch (key) {
    case 'has_least_attachments': {
     if (msg.attachments.size < num) willLevel.push(false);
     break;
    }
    case 'has_most_attachments': {
     if (msg.attachments.size > num) willLevel.push(false);
     break;
    }
    case 'has_least_characters': {
     if (msg.content.length < num) willLevel.push(false);
     break;
    }
    case 'has_most_characters': {
     if (msg.content.length > num) willLevel.push(false);
     break;
    }
    case 'has_least_words': {
     if (msg.content.split(' ').length < num) willLevel.push(false);
     break;
    }
    case 'has_most_words': {
     if (msg.content.split(' ').length > num) willLevel.push(false);
     break;
    }
    case 'mentions_least_users': {
     if (msg.mentions.users.size < num) willLevel.push(false);
     break;
    }
    case 'mentions_most_users': {
     if (msg.mentions.users.size > num) willLevel.push(false);
     break;
    }
    case 'mentions_least_roles': {
     if (msg.mentions.roles.size < num) willLevel.push(false);
     break;
    }
    case 'mentions_most_roles': {
     if (msg.mentions.roles.size > num) willLevel.push(false);
     break;
    }
    case 'mentions_least_channels': {
     if (msg.mentions.channels.size < num) willLevel.push(false);
     break;
    }
    case 'mentions_most_channels': {
     if (msg.mentions.channels.size > num) willLevel.push(false);
     break;
    }
    case 'has_least_links': {
     if (
      Number(
       msg.content.match(
        /(http|https):\/\/(?:[a-z0-9]+(?:[-][a-z0-9]+)*\.)+[a-z]{2,}(?::\d+)?(?:\/\S*)?/gi,
       )?.length,
      ) < num
     ) {
      willLevel.push(false);
     }
     break;
    }
    case 'has_most_links': {
     if (
      Number(
       msg.content.match(
        /(http|https):\/\/(?:[a-z0-9]+(?:[-][a-z0-9]+)*\.)+[a-z]{2,}(?::\d+)?(?:\/\S*)?/gi,
       )?.length,
      ) > num
     ) {
      willLevel.push(false);
     }
     break;
    }
    case 'has_least_emotes': {
     if (Number(msg.content.match(/<(a)?:[a-zA-Z0-9_]+:[0-9]+>/gi)?.length) < num) {
      willLevel.push(false);
     }
     break;
    }
    case 'has_most_emotes': {
     if (Number(msg.content.match(/<(a)?:[a-zA-Z0-9_]+:[0-9]+>/gi)?.length) > num) {
      willLevel.push(false);
     }
     break;
    }
    case 'has_least_mentions': {
     if (msg.mentions.users.size + msg.mentions.channels.size + msg.mentions.roles.size < num) {
      willLevel.push(false);
     }
     break;
    }
    case 'has_most_mentions': {
     if (msg.mentions.users.size + msg.mentions.channels.size + msg.mentions.roles.size > num) {
      willLevel.push(false);
     }
     break;
    }
    default: {
     willLevel.push(true);
     break;
    }
   }
   willLevel.push(true);
  });

  return !willLevel.includes(false);
 });

 if (passes.includes(false)) return false;
 return true;
};

export const levelUp = async (
 levelData: LevelData,
 setting: Prisma.leveling | null,
 member: Discord.GuildMember | Discord.DiscordAPIError | Error,
 msg: Discord.Message<true> | Discord.BaseGuildVoiceChannel,
) => {
 if ('message' in member) return;
 if (!setting) return;
 const language = await member.client.util.getLanguage(member.guild.id);

 switch (setting.lvlupmode) {
  case 'messages': {
   await doEmbed(msg, language, levelData, setting, member.user);
   break;
  }
  case 'reactions': {
   if (!(msg instanceof Discord.Message)) {
    doVoiceStatus(msg, levelData, setting, language, member.user);
    break;
   }
   await doReact(msg, setting, levelData.newLevel, language);
   break;
  }
  default: {
   break;
  }
 }

 roleAssign(member, setting.rolemode, levelData.newLevel, language);
};

const doVoiceStatus = async (
 channel: Discord.BaseGuildVoiceChannel,
 levelData: LevelData,
 settings: leveling,
 language: CT.Language,
 user: Discord.User,
) => {
 channel.client.util.channelStatusManager.add(
  channel,
  `${settings.lvlupemotes
   .map((e) => (e.startsWith('a') ? `<${e}>` : `<:${e}>`))
   .join('')} ${channel.client.util.stp(
   settings.lvluptext?.length
    ? settings.lvluptext
    : language.slashCommands.settings.categories.leveling.status,
   { ...levelData, user },
  )}`,
  Number(settings.lvlupdeltimeout) * 1000,
 );
};

const roleAssign = async (
 member: Discord.GuildMember,
 rolemode: boolean,
 newLevel: number,
 language: CT.Language,
) => {
 const roles = await member.client.util.DataBase.levelingroles.findMany({
  where: { guildid: member.guild.id, level: { lte: newLevel } },
 });
 if (!roles.length) return;

 let add: string[] = [];
 let remove: string[] = [];

 switch (rolemode) {
  case false: {
   roles
    .filter((r) => Number(r.level) <= newLevel)
    .forEach((r) => {
     const roleMap = r.roles
      .map((roleId) => {
       if (!member.roles.cache.has(roleId)) return roleId;
       return undefined;
      })
      .filter((role): role is string => !!role);

     if (!roleMap.length) return;
     add = [...new Set([...add, ...roleMap])];
    });
   break;
  }
  default: {
   if (!roles.find((r) => Number(r.level) === newLevel)) return;

   roles
    .filter((r) => Number(r.level) <= newLevel)
    .forEach((r) => {
     const remr: string[] = [];
     const addr: string[] = [];

     r.roles?.forEach((roleId) => {
      if (
       Number(r.level) < newLevel &&
       member.roles.cache.has(roleId) &&
       member.guild.roles.cache.get(roleId)
      ) {
       remr.push(roleId);
      }

      if (
       Number(r.level) === newLevel &&
       !member.roles.cache.has(roleId) &&
       member.guild.roles.cache.get(roleId)
      ) {
       addr.push(roleId);
      }
     });

     if (addr.length) add = [...new Set([...add, ...addr])];
     if (remr.length) remove = [...new Set([...remove, ...remr])];
    });
  }
 }

 if (!member) return;
 if (add.length) {
  await member.client.util.roleManager.add(member, add, language.autotypes.leveling);
 }
 if (remove.length) {
  await member.client.util.roleManager.remove(member, remove, language.autotypes.leveling);
 }
};

const doReact = async (
 msg: Discord.Message<true>,
 setting: Prisma.leveling,
 newLevel: number,
 language: CT.Language,
) => {
 const reactions = setting.lvlupemotes.length
  ? setting.lvlupemotes
  : msg.client.util.emotes.levelupemotes.map((e) => (!e.id ? e.name : `${e.name}:${e.id}`));

 if (newLevel === 1) infoEmbed(msg, reactions, language);

 await Promise.all(reactions.map((e) => msg.client.util.request.channels.addReaction(msg, e)));

 Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), () => {
  msg.reactions.cache.forEach((r) => {
   if (msg) msg.client.util.request.channels.deleteOwnReaction(msg, r.emoji.identifier);
  });
 });
};

const infoEmbed = async (
 msg: Discord.Message<true>,
 reactions: string[],
 language: CT.Language,
) => {
 const emotes = reactions.map((r) => {
  const animated = r.startsWith('a:');
  const name = animated ? r.split(/:/g)[1] : r.split(/:/g)[0];
  const id = animated ? r.split(/:/g)[2] : r.split(/:/g)[1];

  return msg.client.util.constants.standard.getEmote({ name, id, animated });
 });

 const embed: Discord.APIEmbed = {
  color: msg.client.util.getColor(await msg.client.util.getBotMemberFromGuild(msg.guild)),
  description: language.leveling.description(emotes.join(', ')),
 };

 const m = await msg.client.util.replyMsg(msg, {
  embeds: [embed],
 });

 Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 30000), async () => {
  if (!m) return;
  if (await msg.client.util.isDeleteable(m)) msg.client.util.request.channels.deleteMessage(m);
 });
};

const doEmbed = async (
 msg: Discord.Message<true> | Discord.BaseGuildVoiceChannel,
 language: CT.Language,
 levelData: LevelData,
 setting: Prisma.leveling,
 user: Discord.User,
) => {
 const getDefaultEmbed = async (): Promise<Discord.APIEmbed> => ({
  author: {
   name: language.leveling.author(user, String(levelData.newLevel)),
   icon_url: 'https://cdn.discordapp.com/emojis/807752347782086707.webp?size=4096',
  },
  color: user.client.util.getColor(await user.client.util.getBotMemberFromGuild(msg.guild)),
 });

 const options = [
  ['msg', msg],
  ['user', user],
  ['newLevel', levelData.newLevel],
  ['oldLevel', levelData.oldLevel],
  ['newXP', levelData.newXP],
  ['oldXP', levelData.oldXP],
 ];

 let embed = !setting.embed
  ? user.client.util.dynamicToEmbed(await getDefaultEmbed(), options)
  : undefined;
 if (setting.embed) {
  const customEmbed = await user.client.util.DataBase.customembeds.findUnique({
   where: { uniquetimestamp: setting.embed },
  });

  if (customEmbed) {
   embed = user.client.util.dynamicToEmbed(user.client.util.getDiscordEmbed(customEmbed), options);
  } else embed = user.client.util.dynamicToEmbed(await getDefaultEmbed(), options);
 }

 if (!embed) return;
 send(msg, embed, setting, user);
};

const send = async <T extends Discord.Message<true> | Discord.BaseGuildVoiceChannel>(
 msg: T,
 embed: Discord.APIEmbed,
 setting: Prisma.leveling,
 user: T extends Discord.Message<true> ? undefined : Discord.User,
) => {
 const channelId = msg instanceof Discord.Message ? msg.channelId : msg.id;

 const messages = await msg.client.util
  .send(
   {
    id: setting.lvlupchannels.length ? setting.lvlupchannels : [channelId],
    guildId: msg.guildId,
   },
   {
    embeds: [embed],
    content:
     setting.pingUser && setting.lvlupchannels.length
      ? `<@${(msg instanceof Discord.Message ? msg.author : user)!.id}>`
      : undefined,
    allowed_mentions: { replied_user: setting.pingUser },
   },
  )
  .then((m) => m?.filter((ms): ms is Discord.Message<true> => !!ms));

 if (!messages) return;
 if (!setting.lvlupdeltimeout) return;

 Jobs.scheduleJob(
  getPathFromError(new Error()),
  new Date(
   Date.now() +
    (Number(setting.lvlupdeltimeout) > 5 ? Number(setting.lvlupdeltimeout) * 1000 : 5000) * 100,
  ),
  async () => {
   const deleteable = await Promise.all(messages.map((m) => msg.client.util.isDeleteable(m)));

   messages?.forEach((m, i) => {
    if (deleteable[i]) msg.client.util.request.channels.deleteMessage(m);
   });
  },
 );
};

const checkLevelRoles = async (msg: Discord.Message<true>) => {
 if (!msg.member) return;

 const msgsFromUserLastHour = msg.channel.messages.cache.filter(
  (m) => m.createdTimestamp > Date.now() - 3600000 && m.author?.id === msg.author.id,
 );
 if (msgsFromUserLastHour.size > 2) return;

 const level = await msg.client.util.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: msg.author.id, guildid: msg.guildId, type: 'guild' } },
 });
 if (!level) return;

 const settings = await msg.client.util.DataBase.leveling.findUnique({
  where: { guildid: msg.guildId, active: true, textenabled: true },
 });
 if (!settings) return;

 const roles = await msg.client.util.DataBase.levelingroles.findMany({
  where: { guildid: msg.guildId, level: { lte: level.level } },
 });
 if (!roles.length) return;

 await roleAssign(
  msg.member,
  settings.rolemode,
  Number(level.level),
  await msg.client.util.getLanguage(msg.guildId),
 );
};
