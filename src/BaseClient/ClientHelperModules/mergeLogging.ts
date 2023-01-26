import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';
import stringEmotes from '../Other/StringEmotes.json' assert { type: 'json' };

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
        (before as string) ?? language.none,
        (after as string) ?? language.none,
      );
      break;
    }
    case 'icon': {
      embed.thumbnail = {
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

const boolify = (b: unknown, l: CT.Language) =>
  b
    ? `${stringEmotes.tickWithBackground} ${l.Enabled}`
    : `${stringEmotes.crossWithBackground} ${l.Disabled}`;
