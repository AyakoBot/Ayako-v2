import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings.js';
import emotes from './emotes.js';
import constants from '../Other/constants.js';

/**
 * Merges before and after values based on the given type
 * and adds the result to the provided embed as a field.
 * @param before - The value before the change.
 * @param after - The value after the change.
 * @param type - The type of change.
 * @param embed - The embed to add the result to.
 * @param language - The language object containing translations.
 * @param name - The name of the field to add to the embed.
 * @throws An error if the type is not supported.
 */
export default (
 before: unknown,
 after: unknown,
 type: CT.AcceptedMergingTypes,
 embed: Discord.APIEmbed,
 language: CT.Language,
 name?: string,
) => {
 let value = '';

 switch (type) {
  case 'string': {
   value = language.events.logs.beforeAfter(before as string, after as string);
   break;
  }
  case 'boolean': {
   value = language.events.logs.beforeAfter(boolify(before, language), boolify(after, language));
   break;
  }
  case 'difference': {
   value = language.events.logs.addedRemoved(
    (before as string) ?? language.t.None,
    (after as string) ?? language.t.None,
   );
   break;
  }
  case 'icon': {
   embed.thumbnail = {
    url: `attachment://${after}`,
   };
   break;
  }
  case 'image': {
   embed.image = {
    url: `attachment://${after}`,
   };
   break;
  }
  default: {
   throw new Error(`Unsupported Type "${type}"`);
  }
 }

 if (name) embed.fields?.push({ name, value, inline: true });
};

/**
 * Converts a boolean value to a string representation of its enabled/disabled state.
 * @param b - The boolean value to convert.
 * @param l - An object containing language-specific strings for the enabled/disabled states.
 * @returns A string representation of the boolean value's enabled/disabled state.
 */
const boolify = (b: unknown, l: CT.Language) =>
 b
  ? `${constants.standard.getEmote(emotes.tickWithBackground)} ${l.JSON.Enabled}`
  : `${constants.standard.getEmote(emotes.crossWithBackground)} ${l.JSON.Disabled}`;
