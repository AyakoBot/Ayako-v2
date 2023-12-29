import Prisma, { LevelType } from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as StringSimilarity from 'string-similarity';
import * as ch from '../../../BaseClient/ClientHelper.js';
import ChannelRules from '../../../BaseClient/Other/ChannelRules.js';
import * as CT from '../../../Typings/Typings.js';

type LevelData = { oldXP: number; newXP: number; newLevel: number; oldLevel: number };

export default async (msg: Discord.Message<true>) => {
 if (msg.author.bot) return;

 globalLevelling(msg);
 levelling(msg);
};

const globalLevelling = async (msg: Discord.Message<true>) => {
 if (ch.cache.globalLevellingCD.has(msg.author.id)) return;

 const lastMessage = ch.cache.lastMessageGlobal.get(msg.author.id);
 if (lastMessage && StringSimilarity.compareTwoStrings(msg.content, lastMessage) > 0.9) return;
 ch.cache.lastMessageGlobal.set(msg.author.id, msg.content);

 ch.cache.globalLevellingCD.add(msg.author.id);

 Jobs.scheduleJob(new Date(Date.now() + 60000), () => {
  ch.cache.globalLevellingCD.delete(msg.author.id);
 });

 const level = await ch.DataBase.level.findFirst({
  where: { type: 'global', userid: msg.author.id },
 });

 if (level) updateLevels(msg, null, level, 10, 'global', [1]);
 else insertLevels(msg, 'global', 10, [1]);
};

const levelling = async (msg: Discord.Message<true>) => {
 await checkLevelRoles(msg);
 if (ch.cache.guildLevellingCD.has(msg.author.id)) return;

 const lastMessage = ch.cache.lastMessageGuild.get(msg.author.id);
 if (lastMessage && StringSimilarity.compareTwoStrings(msg.content, lastMessage) > 0.9) return;
 ch.cache.lastMessageGuild.set(msg.author.id, msg.content);
 ch.cache.guildLevellingCD.add(msg.author.id);

 Jobs.scheduleJob(new Date(Date.now() + 60000), () => {
  ch.cache.guildLevellingCD.delete(msg.author.id);
 });

 const settings = await checkEnabled(msg);
 if (settings && !settings.active) return;

 if (Number(msg.content.match(/\s+/g)?.length) < Number(settings?.minwords)) return;

 if (
  settings?.ignoreprefixes &&
  settings?.prefixes.length &&
  settings.prefixes.some((w) => msg.content.toLowerCase().startsWith(w.toLowerCase()))
 ) {
  return;
 }

 if (!settings?.wluserid || !settings.wluserid.includes(msg.author.id)) {
  if (settings?.bluserid && settings.bluserid.includes(msg.author.id)) return;
  if (settings?.blroleid && msg.member?.roles.cache.some((r) => settings.blroleid.includes(r.id))) {
   return;
  }

  if (
   settings?.wlroleid.length &&
   !msg.member?.roles.cache.some((r) => settings?.wlroleid.includes(r.id))
  ) {
   if (settings?.blchannelid && settings.blchannelid.includes(msg.channel.id)) return;
   if (
    settings?.wlchannelid &&
    settings?.wlchannelid.length &&
    !settings.wlchannelid.includes(msg.channel.id)
   ) {
    return;
   }
  }
 }

 const rules = await getRules(msg);
 if (rules.length && !checkRules(msg, rules)) return;

 const level = await ch.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: msg.author.id, guildid: msg.guildId, type: 'guild' } },
 });

 const rewardroles = await ch.DataBase.rolerewards.findMany({
  where: {
   guildid: msg.guildId,
   active: true,
   xpmultiplier: { not: 1 },
  },
 });

 const rewardXPMult = rewardroles.map((r) => Number(r.xpmultiplier)).reduce((a, b) => a + b, 0);

 if (level) {
  updateLevels(msg, settings, level, settings ? Number(settings.xppermsg) - 10 : 15, 'guild', [
   settings ? Number(settings.xpmultiplier) + rewardXPMult : 1,
  ]);
  return;
 }

 insertLevels(msg, 'guild', settings ? Number(settings.xppermsg) - 10 : 15, [
  settings ? Number(settings.xpmultiplier) : 1,
 ]);
};

const getRules = async (msg: Discord.Message<true>) => {
 const settings = await ch.DataBase.levelingruleschannels.findMany({
  where: { guildid: msg.guildId },
 });

 if (!settings.length) return [];
 return settings.filter((s) => s.channels.includes(msg.channel.id));
};

const checkEnabled = async (msg: Discord.Message<true>) =>
 ch.DataBase.leveling.findUnique({ where: { guildid: msg.guildId } });

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
   .map((m) => Math.floor(ch.getRandom(baseXP, baseXP + 10)) * m)
   .reduce((a, b) => a + b) / xpMultiplier.length ?? 1,
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
    msg,
    { oldXP: Number(level.xp), newXP: xp, newLevel: oldLevel + 1, oldLevel },
    settings as Prisma.leveling,
   );
  }
 }

 if (type === 'guild') {
  ch.DataBase.level
   .update({
    where: { userid_guildid_type: { type, userid: msg.author.id, guildid: msg.guildId } },
    data: {
     level: newLevel,
     xp,
    },
   })
   .then();
  return;
 }

 ch.DataBase.level
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
   .map((m) => Math.floor(ch.getRandom(baseXP, baseXP + 10)) * m)
   .reduce((a, b) => a + b) / xpMultiplier.length ?? 1,
 );

 ch.DataBase.level
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
};

const getRoleMultiplier = async (msg: Discord.Message<true>) => {
 if (!msg.guildId) return 1;

 const mps = await ch.DataBase.levelingmultiroles.findMany({
  where: { guildid: msg.guildId },
 });
 if (!mps.length) return 1;

 const mp = mps.filter((r) => msg.member?.roles.cache.some((r2) => r.roles.includes(r2.id)));
 return mp.length ? mp.reduce((a, b) => a + Number(b.multiplier), 0) / mp.length : 1;
};

const getChannelMultiplier = async (msg: Discord.Message<true>) => {
 if (!msg.guildId) return 1;

 const mps = await ch.DataBase.levelingmultichannels.findMany({
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

const levelUp = async (
 msg: Discord.Message<true>,
 levelData: LevelData,
 setting: Prisma.leveling | null,
) => {
 if (!setting) return;
 const language = await ch.getLanguage(msg.guildId);

 switch (setting.lvlupmode) {
  case 'message': {
   await doEmbed(msg, language, levelData, setting);
   break;
  }
  case 'react': {
   await doReact(msg, setting, levelData.newLevel, language);
   break;
  }
  default: {
   break;
  }
 }

 roleAssign(msg, setting.rolemode, levelData.newLevel, language);
};

const roleAssign = async (
 msg: Discord.Message<true>,
 rolemode: boolean,
 newLevel: number,
 language: CT.Language,
) => {
 const roles = await ch.DataBase.levelingroles.findMany({
  where: { guildid: msg.guildId, level: { lte: newLevel } },
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
       if (!msg.member?.roles.cache.has(roleId)) return roleId;
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
       msg.member?.roles.cache.has(roleId) &&
       msg.guild.roles.cache.get(roleId)
      ) {
       remr.push(roleId);
      }

      if (
       Number(r.level) === newLevel &&
       !msg.member?.roles.cache.has(roleId) &&
       msg.guild.roles.cache.get(roleId)
      ) {
       addr.push(roleId);
      }
     });

     if (addr.length) add = [...new Set([...add, ...addr])];
     if (remr.length) remove = [...new Set([...remove, ...remr])];
    });
  }
 }

 if (!msg.member) return;
 if (add.length) await ch.roleManager.add(msg.member, add, language.autotypes.leveling);
 if (remove.length) await ch.roleManager.remove(msg.member, remove, language.autotypes.leveling);
};

const doReact = async (
 msg: Discord.Message<true>,
 setting: Prisma.leveling,
 newLevel: number,
 language: CT.Language,
) => {
 const reactions = setting.lvlupemotes.length
  ? setting.lvlupemotes
  : ch.emotes.levelupemotes.map((e) => (!e.id ? e.name : `${e.name}:${e.id}`));

 if (newLevel === 1) infoEmbed(msg, reactions, language);

 await Promise.all(reactions.map((e) => ch.request.channels.addReaction(msg, e)));

 Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
  msg.reactions.cache.forEach((r) =>
   ch.request.channels.deleteOwnReaction(msg, r.emoji.identifier),
  );
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

  return ch.constants.standard.getEmote({ name, id, animated });
 });

 const embed: Discord.APIEmbed = {
  color: ch.getColor(await ch.getBotMemberFromGuild(msg.guild)),
  description: language.leveling.description(emotes.join(', ')),
 };

 const m = await ch.replyMsg(msg, {
  embeds: [embed],
 });

 Jobs.scheduleJob(new Date(Date.now() + 30000), async () => {
  if (!m) return;
  if (await ch.isDeleteable(m)) ch.request.channels.deleteMessage(m);
 });
};

const doEmbed = async (
 msg: Discord.Message<true>,
 language: CT.Language,
 levelData: LevelData,
 setting: Prisma.leveling,
) => {
 const getDefaultEmbed = async (): Promise<Discord.APIEmbed> => ({
  author: {
   name: language.leveling.author(msg),
  },
  color: ch.getColor(await ch.getBotMemberFromGuild(msg.guild)),
 });

 const options = [
  ['msg', msg],
  ['user', msg.author],
  ['newLevel', levelData.newLevel],
  ['oldLevel', levelData.oldLevel],
  ['newXP', levelData.newXP],
  ['oldXP', levelData.oldXP],
 ];

 let embed = !setting.embed ? ch.dynamicToEmbed(await getDefaultEmbed(), options) : undefined;
 if (setting.embed) {
  const customEmbed = await ch.DataBase.customembeds.findUnique({
   where: { uniquetimestamp: setting.embed },
  });

  if (customEmbed) embed = ch.dynamicToEmbed(ch.getDiscordEmbed(customEmbed), options);
  else embed = ch.dynamicToEmbed(await getDefaultEmbed(), options);
 }

 if (!embed) return;
 send(msg, embed, setting);
};

const send = async (
 msg: Discord.Message<true>,
 embed: Discord.APIEmbed,
 setting: Prisma.leveling,
) => {
 const messages = (await ch.send(
  {
   id: (setting.lvlupchannels.length ? setting.lvlupchannels : msg.channelId) as never,
   guildId: msg.guildId,
  },
  { embeds: [embed] },
 )) as Discord.Message<true> | Discord.Message<true>[] | undefined;

 if (!setting.lvlupdeltimeout) return;

 Jobs.scheduleJob(
  new Date(
   Date.now() +
    (Number(setting.lvlupdeltimeout) > 5 ? Number(setting.lvlupdeltimeout) * 1000 : 5000) * 100,
  ),
  async () => {
   if (Array.isArray(messages)) {
    const deleteable = await Promise.all(messages.map((m) => ch.isDeleteable(m)));
    messages?.forEach((m, i) => {
     if (deleteable[i]) ch.request.channels.deleteMessage(m);
    });
    return;
   }

   if (messages && (await ch.isDeleteable(messages))) ch.request.channels.deleteMessage(messages);
  },
 );
};

const checkLevelRoles = async (msg: Discord.Message<true>) => {
 const msgsFromUserLastHour = msg.channel.messages.cache.filter(
  (m) => m.createdTimestamp > Date.now() - 3600000 && m.author.id === msg.author.id,
 );
 if (msgsFromUserLastHour.size > 2) return;

 const level = await ch.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: msg.author.id, guildid: msg.guildId, type: 'guild' } },
 });
 if (!level) return;

 const settings = await ch.DataBase.leveling.findUnique({
  where: { guildid: msg.guildId, active: true },
 });
 if (!settings) return;

 const roles = await ch.DataBase.levelingroles.findMany({
  where: { guildid: msg.guildId, level: { lte: level.level } },
 });
 if (!roles.length) return;

 await roleAssign(msg, settings.rolemode, Number(level.level), await ch.getLanguage(msg.guildId));
};
