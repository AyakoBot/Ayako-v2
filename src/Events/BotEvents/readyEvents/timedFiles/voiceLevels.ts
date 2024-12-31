import { LevelType, type level, type levelchannels, type leveling } from '@prisma/client';
import type { Guild, GuildMember, VoiceBasedChannel } from 'discord.js';
import { getLevel } from '../../../../Commands/ButtonCommands/set-level/user/calc.js';
import client from '../../../../BaseClient/Bot/Client.js';
import { levelUp } from '../../messageEvents/messageCreate/levelling.js';

type VoiceStateGuild = {
 settings: leveling;
 guild: Guild;
 states: {
  member: GuildMember;
  channel: VoiceBasedChannel;
  level: level | undefined;
  levelchannel: levelchannels | undefined;
 }[];
};

export default async () => {
 const voiceStates = client.guilds.cache
  .map((g) => ({
   guild: g,
   states: g.voiceStates.cache
    .filter((v) => v.channelId)
    .map((v) => ({ member: v.member, channel: v.channel })),
  }))
  .filter((v) => v.states.length)
  .map((v) => ({
   ...v,
   states: v.states.filter(
    (s): s is VoiceStateGuild['states'][number] => !!s.member && !!s.channel,
   ),
  }));

 const settings = await client.util.DataBase.leveling.findMany({
  where: { guildid: { in: voiceStates.map((v) => v.guild.id) }, active: true, voiceenabled: true },
 });

 const levels = (
  await client.util.DataBase.$transaction(
   voiceStates
    .map((v) =>
     client.util.DataBase.level.findMany({
      where: { guildid: v.guild.id, userid: { in: v.states.map((s) => s.member.id) } },
     }),
    )
    .flat(),
  )
 )
  .map((l) => ({ levels: l, guildid: l[0]?.guildid }))
  .filter((l) => l.levels.length && !!l.guildid);

 const levelchannels = (
  await client.util.DataBase.$transaction(
   voiceStates
    .map((v) =>
     client.util.DataBase.levelchannels.findMany({
      where: {
       guildid: v.guild.id,
       OR: v.states.map((s) => ({ userid: s.member.id, channelid: s.channel.id })),
      },
     }),
    )
    .flat(),
  )
 )
  .map((l) => ({ levelchannels: l, guildid: l[0]?.guildid }))
  .filter((l) => l.levelchannels.length);

 const newStates = voiceStates
  .map((v) => ({
   ...v,
   settings: settings.find((s) => s.guildid === v.guild.id),
   states: v.states.map((s) => ({
    ...s,
    level: levels
     .find((l) => l.guildid === v.guild.id)
     ?.levels.find((l) => l.userid === s.member.id),
    levelchannel: levelchannels
     .find((l) => l.guildid === v.guild.id)
     ?.levelchannels.find((l) => l.userid === s.member.id && l.channelid === s.channel.id),
   })),
  }))
  .filter((s): s is VoiceStateGuild => !!s.settings)
  .map((v) => handleVoiceXP(v))
  .filter((v) => !!v);

 const updates = newStates.map((v) =>
  v.states.map((s) => [
   client.util.DataBase.level.upsert({
    where: {
     userid_guildid_type: { guildid: v.guild.id, userid: s.member.id, type: LevelType.guild },
    },
    create: {
     guildid: v.guild.id,
     userid: s.member.id,
     level: s.newLevel,
     xp: s.newLevelXP,
     type: LevelType.guild,
    },
    update: { level: s.newLevel, xp: s.newLevelXP },
   }),
   client.util.DataBase.levelchannels.upsert({
    where: {
     userid_guildid_channelid: {
      userid: s.member.id,
      guildid: v.guild.id,
      channelid: s.channel.id,
     },
    },
    create: {
     userid: s.member.id,
     guildid: v.guild.id,
     channelid: s.channel.id,
     xp: s.newChannelXP,
    },
    update: { xp: s.newChannelXP },
   }),
  ]),
 );

 await client.util.DataBase.$transaction(updates.flat(3));
};

const handleVoiceXP = (v: VoiceStateGuild) => {
 v.states = v.states
  .filter(
   (s) =>
    !s.member.voice.deaf &&
    !s.member.user.bot &&
    (v.settings.requireUnmute ? !s.member.voice.mute : true) &&
    (!v.settings.blchannelid.includes(s.channel.id) ||
     v.settings.wlchannelid.includes(s.channel.id)) &&
    (!s.member.roles.cache.some((r) => v.settings.blroleid.includes(r.id)) ||
     s.member.roles.cache.some((r) => v.settings.wlroleid.includes(r.id))) &&
    (!v.settings.bluserid.includes(s.member.id) || v.settings.wluserid.includes(s.member.id)),
  )
  .filter(
   (s, _, curr) =>
    curr.filter((s2) =>
     s2.channel.id === s.channel.id && v.settings.excludeBots ? !s2.member.user.bot : true,
    ).length >= Number(v.settings.minParticipants),
  );

 if (!v.states.length) return undefined;

 const xp = Number(v.settings.xppermin) * Number(v.settings.xpmultiplier);

 const newStates = v.states
  .map((s) => {
   const sXP = Math.round(Math.random() * 5 - 2.5);

   return {
    ...s,
    newLevelXP: Number(s.level?.xp || 0) + xp * (Number(s.level?.multiplier) || 1) + sXP,
    newChannelXP: Number(s.levelchannel?.xp || 0) + xp * (Number(s.level?.multiplier) || 1) + sXP,
   };
  })
  .map((s) => ({ ...s, newLevel: getLevel(s.newLevelXP) }));

 newStates
  .filter((s) => s.newLevel !== Number(s.level?.level))
  .forEach((s) =>
   levelUp(
    {
     oldXP: Number(s.level?.xp) ?? 0,
     newXP: s.newLevelXP,
     oldLevel: Number(s.level?.level) ?? 0,
     newLevel: s.newLevel,
    },
    v.settings,
    s.member,
    s.channel,
   ),
  );

 return { guild: v.guild, settings: v.settings, states: newStates };
};
