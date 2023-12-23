import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { Returned } from '../../../BaseClient/ClientHelperModules/getPunishment.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const userRes = await ch.getUserFromUserAndUsernameOptions(cmd);
 if (!userRes) return;

 const { user, language, member } = userRes;
 ch.replyCmd(cmd, await getPayload({ user, guild: cmd.guild, language, member }));
};

export const getPayload = async (
 baseInfo: {
  user: Discord.User;
  guild: Discord.Guild;
  language?: CT.Language;
  member?: Discord.GuildMember;
 },
 selected: {
  type?: 'warns' | 'bans' | 'mutes' | 'channelbans' | 'kicks';
  page: number;
  values: number[];
 } = { page: 1, values: [] },
): Promise<Discord.InteractionReplyOptions> => {
 const language = baseInfo.language ?? (await ch.getLanguage(baseInfo.guild.id));
 const lan = language.slashCommands.check;
 const allPunishments = await ch.getPunishment(baseInfo.user.id, {
  identType: 'all-on',
  guildid: baseInfo.guild.id,
 });

 const punishedOpts = {
  isBanned: baseInfo.guild.bans.cache.has(baseInfo.user.id),
  isMuted: baseInfo.member?.isCommunicationDisabled() ?? false,
  isChannelBanned: !!baseInfo.guild.channels.cache.find((c) => {
   const perms = c.permissionsFor(baseInfo.user.id)?.serialize();

   if (!perms) return false;
   if (perms.ViewChannel) return false;
   if (perms.SendMessages) return false;
   if (perms.Connect) return false;
   if (perms.SendMessagesInThreads) return false;
   if (perms.AddReactions) return false;
   return true;
  }),
 };

 const punishmentsOfType = allPunishments?.filter((p) =>
  [`punish_${selected.type}`, `punish_temp${selected.type}`].includes(p.type),
 );

 if (selected.page < 1) selected.page = 1;
 if (selected.page > Math.ceil(Number(punishmentsOfType?.length) / 25)) {
  selected.page = Math.ceil(Number(punishmentsOfType?.length) / 25);
 }

 const punishmentsOfPage = punishmentsOfType?.slice(25 * selected.page - 25, 25 * selected.page);

 return {
  embeds: [
   {
    color: ch.getColor(await ch.getBotMemberFromGuild(baseInfo.guild)),
    author: {
     name: lan.name,
    },
    description: lan.desc(
     baseInfo.user,
     {
      w: allPunishments?.filter((p) => p.type === 'punish_warns').length ?? 0,
      m: allPunishments?.filter((p) => p.type === 'punish_mutes').length ?? 0,
      cb: allPunishments?.filter((p) => p.type === 'punish_channelbans').length ?? 0,
      b: allPunishments?.filter((p) => p.type === 'punish_bans').length ?? 0,
      r: allPunishments?.filter((p) => p.type.includes('temp')).length ?? 0,
     },
     punishedOpts,
     {
      banEmote: ch.constants.standard.getEmote(
       punishedOpts.isBanned ? ch.emotes.banTick : ch.emotes.banCross,
      ),
      muteEmote: ch.constants.standard.getEmote(
       punishedOpts.isMuted ? ch.emotes.timedoutTick : ch.emotes.timedoutCross,
      ),
      channelbanEmote: ch.constants.standard.getEmote(
       punishedOpts.isChannelBanned ? ch.emotes.mutedTick : ch.emotes.mutedCross,
      ),
     },
    ),
   },
   ...selected.values
    .map((v) => punishmentsOfType?.find((p) => Number(p.uniquetimestamp) === v))
    .filter((p): p is Returned => !!p)
    .map(
     (p): Discord.APIEmbed => ({
      color: CT.Colors.Ephemeral,
      description: `${ch.util.makeUnderlined(language.t.Reason)}:\n${p.reason}`,
      fields: [
       {
        name: lan.date,
        value: ch.constants.standard.getTime(Number(p.uniquetimestamp)),
        inline: true,
       },
       {
        name: lan.executor,
        value: language.languageFunction.getUser({
         bot: false,
         username: p.executorname,
         id: p.executorid,
         discriminator: '0',
        }),
        inline: true,
       },
       {
        name: lan.channel,
        value: language.languageFunction.getChannel({ name: p.channelname, id: p.channelid }),
        inline: true,
       },
       {
        name: lan.id,
        value: `${ch.util.makeInlineCode(Number(p.uniquetimestamp).toString(36))}${
         p.type.includes('temp') ? `\n${lan.cantPardon}` : ''
        }`,
        inline: true,
       },
       ...('duration' in p && p.duration
        ? [
           {
            name: lan.duration,
            value: ch.moment(Number(p.duration) * 1000, language),
            inline: true,
           },
           {
            name: lan.endDate,
            value: ch.constants.standard.getTime(
             Number(p.uniquetimestamp) + Number(p.duration) * 1000,
            ),
            inline: true,
           },
          ]
        : []),
       ...('banchannelid' in p && p.banchannelid
        ? [
           {
            name: lan.banChannel,
            value: `<#${p.banchannelid}> / ${ch.util.makeInlineCode(p.banchannelid)}`,
            inline: true,
           },
          ]
        : []),
       {
        name: lan.message,
        value: ch.constants.standard.msgurl(p.guildid, p.channelid, p.msgid),
        inline: true,
       },
      ],
     }),
    ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: Object.entries(lan.punishmentTypes).map(([key, value]) => ({
     label: value,
     custom_id: `mod/check/type_${key}_${baseInfo.user.id}`,
     type: Discord.ComponentType.Button,
     style: selected.type === key ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary,
     disabled: !allPunishments?.filter((p) =>
      [`punish_${key}`, `punish_temp${key}`].includes(p.type),
     ).length,
    })),
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      placeholder: lan.placeholder,
      max_values:
       Number(punishmentsOfPage?.length) > 9 ? 9 : Number(punishmentsOfPage?.length) || 1,
      min_values: 1,
      disabled: !punishmentsOfPage?.length,
      custom_id: `check_${baseInfo.user.id}_${selected.page}${
       selected.type ? `_${selected.type}` : ''
      }`,
      options: punishmentsOfPage?.length
       ? punishmentsOfPage.slice(0, 25).map((p) => ({
          label: `ID: ${Number(p.uniquetimestamp).toString(36)} | ${baseInfo.language?.slashCommands
           .pardon.executor}: ${p.executorname}`,
          description: p.reason?.slice(0, 100),
          value: String(p.uniquetimestamp),
          default: selected.values.includes(Number(p.uniquetimestamp)),
         }))
       : [{ label: '-', value: '-' }],
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      emoji: ch.emotes.back,
      custom_id: `mod/check/page_${selected.type}_${baseInfo.user.id}_back_${selected.page}`,
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      disabled: selected.page === 1 || !selected.type,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      label: `${selected.page}/${Math.ceil(Number(punishmentsOfType?.length) / 25) || 1}`,
      disabled: Number(punishmentsOfType?.length) <= 25 || !selected.type,
      custom_id: `mod/check/select_${selected.type}_${baseInfo.user.id}_${selected.page}_${
       Number(punishmentsOfType?.length) / 25
      }`,
     },
     {
      emoji: ch.emotes.forth,
      custom_id: `mod/check/page_${selected.type}_${baseInfo.user.id}_forth_${selected.page}`,
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      disabled:
       Math.ceil(Number(punishmentsOfType?.length) / 25) === selected.page || !selected.type,
     },
    ],
   },
  ],
 };
};
