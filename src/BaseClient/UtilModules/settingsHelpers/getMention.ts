import * as Discord from 'discord.js';
import type * as CT from '../../../Typings/Typings.js';
import type * as S from '../../../Typings/Settings.js';

export type MentionTypes =
 | S.EditorTypes.Channel
 | S.EditorTypes.Role
 | S.EditorTypes.User
 | S.EditorTypes.Emote
 | S.EditorTypes.ShopType
 | S.EditorTypes.AutoPunishment
 | S.EditorTypes.AntiRaidPunishment
 | S.EditorTypes.Punishment
 | S.EditorTypes.Language
 | S.EditorTypes.RoleMode
 | S.EditorTypes.AutoModRules
 | S.EditorTypes.Commands
 | S.EditorTypes.QuestionType
 | S.EditorTypes.SettingLink
 | S.EditorTypes.Embed
 | S.EditorTypes.Questions
 | S.EditorTypes.LvlUpMode
 | S.EditorTypes.WeekendsType;

/**
 * Returns a mention string based on the given type and value.
 * @param language - The language object containing language strings.
 * @param type - The type of mention to generate.
 * @param value - The value to use for the mention.
 * @param guild - The guild object to use for certain types of mentions.
 * @returns A mention string based on the given type and value.
 */
export default async (
 language: CT.Language,
 type: MentionTypes,
 value: string,
 guild: Discord.Guild,
) => {
 switch (type) {
  case language.client.util.CT.EditorTypes.Channel:
   return `<#${value}>`;
  case language.client.util.CT.EditorTypes.Role:
   return `<@&${value}>`;
  case language.client.util.CT.EditorTypes.User:
   return `<@${value}>`;
  case language.client.util.CT.EditorTypes.ShopType:
   return language.shoptypes[value as keyof typeof language.shoptypes];
  case language.client.util.CT.EditorTypes.AutoPunishment:
  case language.client.util.CT.EditorTypes.AntiRaidPunishment:
  case language.client.util.CT.EditorTypes.Punishment:
   return language.punishments[value as keyof typeof language.punishments];
  case language.client.util.CT.EditorTypes.Language:
   return language.languages[value as keyof typeof language.languages];
  case language.client.util.CT.EditorTypes.RoleMode:
   return language.rolemodes[value as keyof typeof language.rolemodes];
  case language.client.util.CT.EditorTypes.Emote:
   return value.includes(':') ? `<${value}>` : value;
  case language.client.util.CT.EditorTypes.AutoModRules:
   return language.client.util.util.makeInlineCode(
    (guild as NonNullable<typeof guild>).autoModerationRules.cache.get(value)?.name ?? value,
   );
  case language.client.util.CT.EditorTypes.Commands: {
   const cmd = guild.client.application?.commands.cache.get(value);

   if (!cmd) return `\`${value}\``;
   return `</${cmd?.name}:${cmd?.id}>`;
  }
  case language.client.util.CT.EditorTypes.QuestionType:
   return language.answertypes[value as keyof typeof language.answertypes];
  case language.client.util.CT.EditorTypes.LvlUpMode:
   return language.lvlupmodes[value as keyof typeof language.lvlupmodes];
  case language.client.util.CT.EditorTypes.WeekendsType:
   return language.weekendstype[value as keyof typeof language.weekendstype];
  default:
   return value;
 }
};
