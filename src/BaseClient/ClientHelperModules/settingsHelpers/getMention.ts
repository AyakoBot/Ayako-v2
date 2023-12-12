import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';
import client from '../../Client.js';
import { makeInlineCode } from '../util.js';

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
 type: CT.MentionTypes,
 value: string,
 guild: Discord.Guild,
) => {
 switch (type) {
  case 'channel':
   return `<#${value}>`;
  case 'role':
   return `<@&${value}>`;
  case 'user':
   return `<@${value}>`;
  case 'shoptype':
   return language.shoptypes[value as keyof typeof language.shoptypes];
  case 'auto-punishment':
  case 'antiraid-punishment':
  case 'punishment':
   return language.punishments[value as keyof typeof language.punishments];
  case 'language':
   return language.languages[value as keyof typeof language.languages];
  case 'rolemode':
   return language.rolemodes[value as keyof typeof language.rolemodes];
  case 'emote':
   return value.includes(':') ? `<${value}>` : value;
  case 'automodrules':
   return makeInlineCode(
    (guild as NonNullable<typeof guild>).autoModerationRules.cache.get(value)?.name ?? value,
   );
  case 'commands': {
   const cmd = client.application?.commands.cache.get(value);

   if (!cmd) return `\`${value}\``;
   return `</${cmd?.name}:${cmd?.id}>`;
  }

  default:
   return value;
 }
};
