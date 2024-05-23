import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import client from '../../../BaseClient/Bot/Client.js';
import * as CT from '../../../Typings/Typings.js';

const month = 2629743000;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const userRes = await client.util.getUserFromUserAndUsernameOptions(cmd);
 if (!userRes) return;

 const { user, language } = userRes;
 const lan = language.slashCommands.info.user;

 const flags = await cmd.client.util.request.users
  .get(cmd.guild, user.id, cmd.client)
  .then((u) =>
   u && !('message' in u)
    ? u.flags ?? new Discord.UserFlagsBitField()
    : new Discord.UserFlagsBitField(),
  );
 if (user.bot && !flags.has(65536)) flags.add(2048);

 let botInfo: { info: string; description: string } | null = null;
 if (user.bot) botInfo = await getBotInfo(user, language);

 const userflags = client.util.userFlagsCalc(flags.bitfield, language, true);
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
 const member = cmd.guild
  ? await client.util.request.guilds
     .getMember(cmd.guild, user.id)
     .then((m) => ('message' in m ? undefined : m))
  : undefined;
 const components = getComponents(member, user, language, cmd.guild);

 if (botInfo && botInfo.description) {
  userInfo.fields?.push({ name: language.t.Description, value: botInfo.description });
 }

 if (userflags.length) {
  userInfo.fields?.push({
   name: lan.flags,
   value: userflags.join('\n'),
   inline: false,
  });
 }

 userInfo.fields?.push({
  name: `${client.util.constants.standard.getEmote(client.util.emotes.plusBG)} ${lan.createdAt}`,
  value: `${client.util.constants.standard.getTime(user.createdTimestamp)}\n\`${client.util.moment(
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
    value: client.util.util.makeInlineCode(member.displayName),
    inline: false,
   },
   {
    name: lan.timeout,
    value: `${
     member.communicationDisabledUntil && member.isCommunicationDisabled()
      ? `${client.util.constants.standard.getEmote(client.util.emotes.tickWithBackground)} ${
         language.t.Yes
        }\n${lan.communicationDisabledUntil} ${client.util.constants.standard.getTime(
         member.communicationDisabledUntilTimestamp,
        )}`
      : `${client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground)} ${
         language.t.No
        }`
    }`,
    inline: false,
   },
   {
    name: `${client.util.constants.standard.getEmote(client.util.emotes.plusBG)} ${lan.joinedAt}`,
    value: `${client.util.constants.standard.getTime(member.joinedTimestamp ?? 0)}`,
   },
   {
    name: lan.boosting,
    value: `${
     member.premiumSinceTimestamp
      ? `${client.util.constants.standard.getEmote(client.util.emotes.tickWithBackground)} ${
         language.t.Yes
        }\n${client.util.constants.standard.getEmote(getBoostEmote(member))} ${lan.boostingSince} ${client.util.constants.standard.getTime(
         member.premiumSinceTimestamp,
        )}`
      : `${client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground)} ${
         language.t.No
        }`
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
  headers: { Authorization: process.env.topGGtoken ?? '' },
 })
  .then(
   (r) => r.json() as Promise<CT.TopGGResponse<true> | CT.TopGGResponse<false>> | Promise<null>,
  )
  .catch(() => undefined);

 if (!res || 'error' in res) return null;
 return { info: language.slashCommands.info.user.botInfo(res, bot.id), description: res.shortdesc };
};

const getBoosting = async (flags: string[], user: Discord.User, language: CT.Language) => {
 const boostTimes = (
  await user.client.cluster?.broadcastEval(
   (cl, { memberId }) =>
    cl.guilds.cache.map((g) => g.members.cache.get(memberId)?.premiumSinceTimestamp ?? 0),
   { context: { memberId: user.id } },
  )
 )
  ?.flat()
  .filter((t) => !!t);

 if (!boostTimes?.length) return;
 const longestPrem = Math.min(...boostTimes);
 if (!longestPrem) return;

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

 const translatedBoostFlags = await client.util.memberBoostCalc(
  boostFlags.bitfield,
  language,
  true,
 );
 flags.push(...translatedBoostFlags);
};

const getBoostEmote = (member: Discord.GuildMember) => {
 if (!member.premiumSinceTimestamp) return client.util.emotes.invis;
 const time = Math.abs(member.premiumSinceTimestamp - Date.now());

 if (time < month * 2) return client.util.emotes.userFlags.Boost1;
 if (time < month * 3) return client.util.emotes.userFlags.Boost2;
 if (time < month * 6) return client.util.emotes.userFlags.Boost3;
 if (time < month * 9) return client.util.emotes.userFlags.Boost6;
 if (time < month * 12) return client.util.emotes.userFlags.Boost9;
 if (time < month * 15) return client.util.emotes.userFlags.Boost12;
 if (time < month * 18) return client.util.emotes.userFlags.Boost15;
 if (time < month * 24) return client.util.emotes.userFlags.Boost18;
 return client.util.emotes.userFlags.Boost24;
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
      custom_id: `info/roles_member_${user.id}`,
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
