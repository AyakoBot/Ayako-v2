import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';
import auth from '../../../auth.json' assert { type: 'json' };

const month = 2629743000;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const userID = cmd.options.get('user-name', false)?.value as string | null;
 const language = await ch.languageSelector(cmd.guild?.id);
 const lan = language.slashCommands.info.user;

 if (userID && userID.replace(/\D+/g, '').length !== userID.length) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const user =
  cmd.options.getUser('user-mention', false) ??
  (userID ? await client.users.fetch(userID).catch(() => undefined) : cmd.user) ??
  cmd.user;

 if (!user) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const flags = await user.fetchFlags(true);
 if (user.bot && !flags.has(65536)) flags.add(2048);

 let botInfo: { info: string; description: string } | null = null;
 if (user.bot) botInfo = await getBotInfo(user, language);

 const userflags = ch.userFlagsCalc(flags.bitfield, language, true);
 await getBoosting(userflags, user, language);

 if (
  new URL(user.displayAvatarURL({ size: 4096 })).pathname.endsWith('.gif') ||
  user.bannerURL({ size: 4096 })
 ) {
  flags.add(4096);
 }

 const banner = user.bannerURL({ size: 4096 });

 const userInfo: Discord.APIEmbed = {
  author: {
   name: user.bot ? lan.authorBot : lan.authorUser,
  },
  thumbnail: {
   url: user.displayAvatarURL({ size: 4096 }),
  },
  image: banner
   ? {
      url: banner,
     }
   : undefined,
  color: user.accentColor ?? undefined,
  description: `${lan.userInfo(user)}${botInfo ? `\n${botInfo.info}` : ''}`,
  fields: [],
 };
 const embeds = [userInfo];
 const member = await cmd.guild?.members.fetch(user.id)?.catch(() => undefined);
 const components = getComponents(member, user, language, cmd.guild);

 if (botInfo && botInfo.description) {
  userInfo.fields?.push({ name: language.Description, value: botInfo.description });
 }

 if (userflags.length) {
  userInfo.fields?.push({
   name: lan.flags,
   value: userflags.join('\n'),
   inline: false,
  });
 }

 userInfo.fields?.push({
  name: `${ch.stringEmotes.plusBG} ${lan.createdAt}`,
  value: `${ch.constants.standard.getTime(user.createdTimestamp)}\n\`${ch.moment(
   Date.now() - user.createdTimestamp,
   language,
  )}\``,
 });

 if (user.accentColor) userInfo.footer = { text: lan.footer };
 if (member) getMemberEmbed(embeds, member, user, language);

 cmd.reply({
  components,
  embeds,
  ephemeral: true,
 });
};

const getMemberEmbed = (
 embeds: Discord.APIEmbed[],
 member: Discord.GuildMember,
 user: Discord.User,
 language: CT.Language,
) => {
 const lan = language.slashCommands.info.user;

 const memberEmbed: Discord.APIEmbed = {
  author: {
   name: user.bot ? lan.memberAuthorBot : lan.memberAuthorUser,
  },
  fields: [
   {
    name: lan.displayName,
    value: ch.util.makeInlineCode(member.displayName),
    inline: false,
   },
   {
    name: lan.timeout,
    value: `${
     member.communicationDisabledUntil && member.isCommunicationDisabled()
      ? `${ch.stringEmotes.tickWithBackground} ${language.Yes}\n${
         lan.communicationDisabledUntil
        } ${ch.constants.standard.getTime(member.communicationDisabledUntilTimestamp)}`
      : `${ch.stringEmotes.crossWithBackground} ${language.No}`
    }`,
    inline: false,
   },
   {
    name: `${ch.stringEmotes.plusBG} ${lan.joinedAt}`,
    value: `${ch.constants.standard.getTime(member.joinedTimestamp ?? 0)}`,
   },
   {
    name: `${getBoostEmote(member)} ${lan.boosting}`,
    value: `${
     member.premiumSinceTimestamp
      ? `${ch.stringEmotes.tickWithBackground} ${language.Yes}\n${
         lan.boostingSince
        } ${ch.constants.standard.getTime(member.premiumSinceTimestamp)}`
      : `${ch.stringEmotes.crossWithBackground} ${language.No}`
    }`,
   },
  ],
 };

 if (member.displayAvatarURL({ size: 4096 }) !== user.displayAvatarURL({ size: 4096 })) {
  memberEmbed.thumbnail = { url: member.displayAvatarURL({ size: 4096 }) };
 }

 embeds.push(memberEmbed);
};

const getBotInfo = async (bot: Discord.User, language: CT.Language) => {
 const res = await fetch(`https://top.gg/api/bots/${bot.id}`, {
  headers: { Authorization: auth.topGGtoken },
 })
  .then(
   (r) => r.json() as Promise<CT.TopGGResponse<true> | CT.TopGGResponse<false>> | Promise<null>,
  )
  .catch(() => undefined);

 if (!res || 'error' in res) return null;
 return { info: language.slashCommands.info.user.botInfo(res), description: res.shortdesc };
};

const getBoosting = async (flags: string[], user: Discord.User, language: CT.Language) => {
 const boostTimes = user.client.shard
  ? (
     await user.client.shard.broadcastEval(
      (cl, { memberId }) =>
       cl.guilds.cache.map((g) => g.members.cache.get(memberId)?.premiumSinceTimestamp ?? 0),
      { context: { memberId: user.id } },
     )
    ).flat()
  : [];

 const longestPrem = Math.min(...boostTimes);
 const boostFlags = new Discord.BitField();
 const time = Math.abs(longestPrem - Date.now());

 if (time < month * 2) boostFlags.add(1);
 else if (time < month * 3) boostFlags.add(2);
 else if (time < month * 6) boostFlags.add(4);
 else if (time < month * 9) boostFlags.add(8);
 else if (time < month * 12) boostFlags.add(16);
 else if (time < month * 15) boostFlags.add(32);
 else if (time < month * 18) boostFlags.add(64);
 else if (time < month * 24) boostFlags.add(128);
 else boostFlags.add(256);

 const translatedBoostFlags = await ch.memberBoostCalc(boostFlags.bitfield, language, true);
 flags.push(...translatedBoostFlags);
};

const getBoostEmote = (member: Discord.GuildMember) => {
 if (!member.premiumSinceTimestamp) return '';
 const time = Math.abs(member.premiumSinceTimestamp - Date.now());

 if (time < month * 2) return ch.stringEmotes.userFlags.Boost1;
 if (time < month * 3) return ch.stringEmotes.userFlags.Boost2;
 if (time < month * 6) return ch.stringEmotes.userFlags.Boost3;
 if (time < month * 9) return ch.stringEmotes.userFlags.Boost6;
 if (time < month * 12) return ch.stringEmotes.userFlags.Boost9;
 if (time < month * 15) return ch.stringEmotes.userFlags.Boost12;
 if (time < month * 18) return ch.stringEmotes.userFlags.Boost15;
 if (time < month * 24) return ch.stringEmotes.userFlags.Boost18;
 return ch.stringEmotes.userFlags.Boost24;
};

const getComponents = (
 member: Discord.GuildMember | undefined,
 user: Discord.User,
 language: CT.Language,
 guild: Discord.Guild | null,
): Discord.APIActionRowComponent<Discord.APIButtonComponent | Discord.APISelectMenuComponent>[] => {
 const lan = language.slashCommands.info.user;

 const linkButtons: Discord.APIButtonComponent[] = [
  {
   type: Discord.ComponentType.Button,
   style: Discord.ButtonStyle.Link,
   label: lan.desktop,
   url: `discord://-/users/${user.id}`,
  },
  {
   type: Discord.ComponentType.Button,
   style: Discord.ButtonStyle.Link,
   label: lan.browser,
   url: `https://discord.com/users/${user.id}`,
  },
  {
   type: Discord.ComponentType.Button,
   style: Discord.ButtonStyle.Link,
   label: lan.mobile,
   url: `https://discord.com/users/${user.id}`,
  },
 ];

 if (member && guild) {
  return [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      disabled: member.roles.cache.size <= 1,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/roles_${user.id}`,
      label: lan.viewRoles,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/basicPerms_${user.id}`,
      label: lan.viewBasicPermissions,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.ChannelSelect,
      custom_id: `info/perms_${user.id}_user`,
      placeholder: lan.viewChannelPermissions,
      max_values: 1,
      min_values: 1,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: linkButtons,
   },
  ];
 }

 return [
  {
   type: Discord.ComponentType.ActionRow,
   components: linkButtons,
  },
 ];
};
