import Discord from 'discord.js';
import stringEmotes from '../Other/StringEmotes.json' assert { type: 'json' };

export default async (
  bits: number,
  lan: typeof import('../../Languages/en.json'),
  emotes = false,
) => {
  if (!bits) return [];
  const bitField = new Discord.PermissionsBitField(BigInt(bits));
  const flags = [];

  switch (true) {
    case bitField.has(1n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost1 : ''} ${lan.userFlags.Boost1}`);
      break;
    }
    case bitField.has(2n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost2 : ''} ${lan.userFlags.Boost2}`);
      break;
    }
    case bitField.has(4n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost3 : ''} ${lan.userFlags.Boost3}`);
      break;
    }
    case bitField.has(8n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost6 : ''} ${lan.userFlags.Boost6}`);
      break;
    }
    case bitField.has(16n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost9 : ''} ${lan.userFlags.Boost9}`);
      break;
    }
    case bitField.has(32n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost12 : ''} ${lan.userFlags.Boost12}`);
      break;
    }
    case bitField.has(64n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost15 : ''} ${lan.userFlags.Boost15}`);
      break;
    }
    case bitField.has(128n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost18 : ''} ${lan.userFlags.Boost18}`);
      break;
    }
    case bitField.has(256n): {
      flags.push(`${emotes ? stringEmotes.userFlags.Boost24 : ''} ${lan.userFlags.Boost24}`);
      break;
    }
    default: {
      break;
    }
  }

  return flags;
};
