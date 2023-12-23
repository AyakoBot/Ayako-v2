import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import client from '../../Client.js';
import { makeInlineCode } from '../util.js';

export type MentionTypes =
 | CT.EditorTypes.Channel
 | CT.EditorTypes.Role
 | CT.EditorTypes.User
 | CT.EditorTypes.Emote
 | CT.EditorTypes.ShopType
 | CT.EditorTypes.AutoPunishment
 | CT.EditorTypes.AntiRaidPunishment
 | CT.EditorTypes.Punishment
 | CT.EditorTypes.Language
 | CT.EditorTypes.RoleMode
 | CT.EditorTypes.Emotes
 | CT.EditorTypes.AutoModRules
 | CT.EditorTypes.Commands
 | CT.EditorTypes.QuestionType
 | CT.EditorTypes.SettingLink
 | CT.EditorTypes.Embed
 | CT.EditorTypes.Questions;

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
  case CT.EditorTypes.Channel:
   return `<#${value}>`;
  case CT.EditorTypes.Role:
   return `<@&${value}>`;
  case CT.EditorTypes.User:
   return `<@${value}>`;
  case CT.EditorTypes.ShopType:
   return language.shoptypes[value as keyof typeof language.shoptypes];
  case CT.EditorTypes.AutoPunishment:
  case CT.EditorTypes.AntiRaidPunishment:
  case CT.EditorTypes.Punishment:
   return language.punishments[value as keyof typeof language.punishments];
  case CT.EditorTypes.Language:
   return language.languages[value as keyof typeof language.languages];
  case CT.EditorTypes.RoleMode:
   return language.rolemodes[value as keyof typeof language.rolemodes];
  case CT.EditorTypes.Emote:
   return value.includes(':') ? `<${value}>` : value;
  case CT.EditorTypes.AutoModRules:
   return makeInlineCode(
    (guild as NonNullable<typeof guild>).autoModerationRules.cache.get(value)?.name ?? value,
   );
  case CT.EditorTypes.Commands: {
   const cmd = client.application?.commands.cache.get(value);

   if (!cmd) return `\`${value}\``;
   return `</${cmd?.name}:${cmd?.id}>`;
  }
  case CT.EditorTypes.QuestionType:
   return language.answertypes[value as keyof typeof language.answertypes];
  default:
   return value;
 }
};
