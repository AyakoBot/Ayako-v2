import ChannelRules from '../Other/ChannelRules';

export default (bits: number, lan: typeof import('../../Languages/en.json')) => {
  if (!bits) return [];
  const BitField = new ChannelRules(bits);
  const Rules = [];

  switch (true) {
    case BitField.has(1): {
      Rules.push(lan.channelRules.HasLeastAttachments);
      break;
    }
    case BitField.has(2): {
      Rules.push(lan.channelRules.HasMostAttachments);
      break;
    }
    case BitField.has(4): {
      Rules.push(lan.channelRules.HasLeastCharacters);
      break;
    }
    case BitField.has(8): {
      Rules.push(lan.channelRules.HasMostCharacters);
      break;
    }
    case BitField.has(16): {
      Rules.push(lan.channelRules.HasLeastWords);
      break;
    }
    case BitField.has(32): {
      Rules.push(lan.channelRules.HasMostWords);
      break;
    }
    case BitField.has(64): {
      Rules.push(lan.channelRules.MentionsLeastUsers);
      break;
    }
    case BitField.has(128): {
      Rules.push(lan.channelRules.MentionsMostUsers);
      break;
    }
    case BitField.has(256): {
      Rules.push(lan.channelRules.MentionsLeastChannels);
      break;
    }
    case BitField.has(512): {
      Rules.push(lan.channelRules.MentionsMostChannels);
      break;
    }
    case BitField.has(1024): {
      Rules.push(lan.channelRules.MentionsLeastRoles);
      break;
    }
    case BitField.has(2048): {
      Rules.push(lan.channelRules.MentionsMostRoles);
      break;
    }
    case BitField.has(4096): {
      Rules.push(lan.channelRules.HasMostCharacters);
      break;
    }
    case BitField.has(8192): {
      Rules.push(lan.channelRules.HasMostLinks);
      break;
    }
    case BitField.has(16384): {
      Rules.push(lan.channelRules.HasLeastEmotes);
      break;
    }
    case BitField.has(32768): {
      Rules.push(lan.channelRules.HasMostEmotes);
      break;
    }
    case BitField.has(65536): {
      Rules.push(lan.channelRules.HasLeastMentions);
      break;
    }
    case BitField.has(131072): {
      Rules.push(lan.channelRules.HasMostMentions);
      break;
    }
    default: {
      break;
    }
  }

  return Rules;
};
