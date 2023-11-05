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
 userId: string,
 zerosXP: number,
 language: CT.Language,
): Discord.APIButtonComponent[] =>
 (
  [
   {
    label: '10',
    custom_id: `set-level/user/zero_x_-_${userId}`,
    disabled: zerosXP === 0,
    emoji: { name: '➗' },
   },
   {
    label: `-1${'0'.repeat(zerosXP)}`,
    custom_id: `set-level/user/calc_x_-_${userId}`,
   },
   {
    label: language.slashCommands.setLevel.reset,
    custom_id: `set-level/user/reset_${userId}_x`,
    style: Discord.ButtonStyle.Danger,
   },
   {
    label: `+1${'0'.repeat(zerosXP)}`,
    custom_id: `set-level/user/calc_x_+_${userId}`,
   },
   {
    label: `10`,
    custom_id: `set-level/user/zero_x_+_${userId}`,
    emoji: { name: '✖️' },
   },
  ] as const
 ).map((b) => ({ type: Discord.ComponentType.Button, style: Discord.ButtonStyle.Primary, ...b }));

export const getLevelComponents = (
 userId: string,
 zerosLevel: number,
 language: CT.Language,
): Discord.APIButtonComponent[] =>
 (
  [
   {
    label: '10',
    custom_id: `set-level/user/zero_l_-_${userId}`,
    disabled: zerosLevel === 0,
    emoji: { name: '➗' },
   },
   {
    label: `-1${'0'.repeat(zerosLevel)}`,
    custom_id: `set-level/user/calc_l_-_${userId}`,
   },
   {
    label: language.slashCommands.setLevel.reset,
    custom_id: `set-level/user/reset_${userId}_l`,
    style: Discord.ButtonStyle.Danger,
   },
   {
    label: `+1${'0'.repeat(zerosLevel)}`,
    custom_id: `set-level/user/calc_l_+_${userId}`,
   },
   {
    label: `10`,
    custom_id: `set-level/user/zero_l_+_${userId}`,
    emoji: { name: '✖️' },
   },
  ] as const
 ).map((b) => ({ type: Discord.ComponentType.Button, style: Discord.ButtonStyle.Primary, ...b }));

const getSaveAndCancel = (userId: string, language: CT.Language): Discord.APIButtonComponent[] =>
 (
  [
   {
    label: language.slashCommands.setLevel.cancel,
    custom_id: 'set-level/user/cancel',
    style: Discord.ButtonStyle.Danger,
    emoji: ch.emotes.crossWithBackground,
   },
   {
    label: language.slashCommands.setLevel.save,
    custom_id: `set-level/user/save_${userId}`,
    style: Discord.ButtonStyle.Success,
    emoji: ch.emotes.tickWithBackground,
   },
  ] as const
 ).map((b) => ({ type: Discord.ComponentType.Button, ...b }));

export const getComponents = (
 userId: string,
 zerosXP: number,
 zerosLevel: number,
 language: CT.Language,
): Discord.APIButtonComponent[] => [
 ...getXPComponents(userId, zerosXP, language),
 ...getLevelComponents(userId, zerosLevel, language),
 ...getSaveAndCancel(userId, language),
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
 description: language.slashCommands.setLevel.desc(user),
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
