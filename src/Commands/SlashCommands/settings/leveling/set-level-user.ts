import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: string[],
 u: Discord.User,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const user = cmd instanceof Discord.ButtonInteraction ? u : cmd.options.getUser('user', true);
 const level = await ch.DataBase.level.findUnique({
  where: { userid_guildid_type: { guildid: cmd.guildId, userid: user.id, type: 'guild' } },
 });

 const embed = getEmbed(
  user,
  language,
  { xp: Number(level?.xp), level: Number(level?.level) },
  { xp: Number(level?.xp), level: Number(level?.level) },
 );

 const compChunks = ch.getChunks(getComponents(user.id, 0, 0, language), 5);

 if (cmd instanceof Discord.ButtonInteraction) {
  cmd.update({
   embeds: [embed],
   components: compChunks.map((c) => ({ type: Discord.ComponentType.ActionRow, components: c })),
  });
 } else {
  ch.replyCmd(cmd, {
   embeds: [embed],
   components: compChunks.map((c) => ({ type: Discord.ComponentType.ActionRow, components: c })),
  });
 }
};

export const getXPComponents = (
 roleOrUserId: string,
 zerosXP: number,
 language: CT.Language,
 type: 'user' | 'role' = 'user',
): Discord.APIButtonComponent[] =>
 (
  [
   {
    label: '10',
    custom_id: `set-level/${type}/zero_x_-_${roleOrUserId}`,
    disabled: zerosXP === 0,
    emoji: { name: '➗' },
   },
   {
    label: `-1${'0'.repeat(zerosXP)}`,
    custom_id: `set-level/${type}/calc_x_-_${roleOrUserId}`,
   },
   {
    label: language.slashCommands.leaderboard.xp,
    custom_id: `xp`,
    disabled: true,
    style: Discord.ButtonStyle.Secondary,
   },
   {
    label: `+1${'0'.repeat(zerosXP)}`,
    custom_id: `set-level/${type}/calc_x_+_${roleOrUserId}`,
   },
   {
    label: `10`,
    custom_id: `set-level/${type}/zero_x_+_${roleOrUserId}`,
    emoji: { name: '✖️' },
   },
  ] as const
 ).map((b) => ({ type: Discord.ComponentType.Button, style: Discord.ButtonStyle.Primary, ...b }));

export const getLevelComponents = (
 roleOrUserId: string,
 zerosLevel: number,
 language: CT.Language,
 type: 'user' | 'role' = 'user',
): Discord.APIButtonComponent[] =>
 (
  [
   {
    label: '10',
    custom_id: `set-level/${type}/zero_l_-_${roleOrUserId}`,
    disabled: zerosLevel === 0,
    emoji: { name: '➗' },
   },
   {
    label: `-1${'0'.repeat(zerosLevel)}`,
    custom_id: `set-level/${type}/calc_l_-_${roleOrUserId}`,
   },
   {
    label: language.slashCommands.leaderboard.level,
    custom_id: `lvl`,
    disabled: true,
    style: Discord.ButtonStyle.Secondary,
   },
   {
    label: `+1${'0'.repeat(zerosLevel)}`,
    custom_id: `set-level/${type}/calc_l_+_${roleOrUserId}`,
   },
   {
    label: `10`,
    custom_id: `set-level/${type}/zero_l_+_${roleOrUserId}`,
    emoji: { name: '✖️' },
   },
  ] as const
 ).map((b) => ({ type: Discord.ComponentType.Button, style: Discord.ButtonStyle.Primary, ...b }));

const getSaveAndCancel = (
 roleOrUserId: string,
 language: CT.Language,
 type: 'user' | 'role' = 'user',
): Discord.APIButtonComponent[] =>
 (
  [
   {
    label: language.slashCommands.setLevel.cancel,
    custom_id: `set-level/${type}/cancel`,
    style: Discord.ButtonStyle.Danger,
    emoji: ch.emotes.crossWithBackground,
   },
   {
    label: language.slashCommands.setLevel.save,
    custom_id: `set-level/${type}/save_${roleOrUserId}`,
    style: Discord.ButtonStyle.Success,
    emoji: ch.emotes.tickWithBackground,
   },
  ] as const
 ).map((b) => ({ type: Discord.ComponentType.Button, ...b }));

export const getComponents = (
 roleOrUserId: string,
 zerosXP: number,
 zerosLevel: number,
 language: CT.Language,
 type: 'user' | 'role' = 'user',
): Discord.APIButtonComponent[] => [
 ...getXPComponents(roleOrUserId, zerosXP, language, type),
 ...getLevelComponents(roleOrUserId, zerosLevel, language, type),
 ...getSaveAndCancel(roleOrUserId, language, type),
];

export const getEmbed = (
 user: Discord.User,
 language: CT.Language,
 { xp, level }: { xp: number; level: number },
 { xp: newXP, level: newLevel }: { xp: number; level: number },
): Discord.APIEmbed => ({
 author: {
  name: language.slashCommands.setLevel.author,
 },
 description: language.slashCommands.setLevel.descUser(user),
 color: ch.constants.colors.ephemeral,
 fields: [
  {
   name: language.slashCommands.leaderboard.currentXP,
   value: ch.splitByThousand(xp),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.newXP,
   value: ch.splitByThousand(newXP),
   inline: true,
  },
  {
   name: '\u200b',
   value: '\u200b',
   inline: false,
  },
  {
   name: language.slashCommands.leaderboard.currentLvl,
   value: ch.splitByThousand(level),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.newLvl,
   value: ch.splitByThousand(newLevel),
   inline: true,
  },
 ],
});
