import type * as DDeno from 'discordeno';
import type CT from '../../Typings/CustomTypings';
import stringEmotes from '../Other/StringEmotes.json' assert { type: 'json' };

export default (
  before: unknown,
  after: unknown,
  type: CT.AcceptedMergingTypes,
  embed: DDeno.Embed,
  language: CT.Language,
  name: string,
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
    default: {
      throw new Error(`Unsupported Type "${type}"`);
    }
  }

  embed.fields?.push({ name, value, inline: true });
};

const boolify = (b: unknown, l: CT.Language) =>
  b
    ? `${l.Enabled} ${stringEmotes.tickWithBackground}`
    : `${l.Disabled} ${stringEmotes.crossWithBackground}`;
