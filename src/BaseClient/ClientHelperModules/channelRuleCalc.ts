import Prisma from '@prisma/client';
import ChannelRules from '../Other/ChannelRules.js';
import type CT from '../../Typings/CustomTypings.js';

export default (s: Prisma.levelingruleschannels, lan: CT.Language) => {
 const BitField = new ChannelRules(s);
 const Rules = [];

 if (BitField.has(1)) Rules.push(lan.channelRules.HasLeastAttachments('-'));
 if (BitField.has(2)) Rules.push(lan.channelRules.HasMostAttachments('-'));
 if (BitField.has(4)) Rules.push(lan.channelRules.HasLeastCharacters('-'));
 if (BitField.has(8)) Rules.push(lan.channelRules.HasMostCharacters('-'));
 if (BitField.has(16)) Rules.push(lan.channelRules.HasLeastWords('-'));
 if (BitField.has(32)) Rules.push(lan.channelRules.HasMostWords('-'));
 if (BitField.has(64)) Rules.push(lan.channelRules.MentionsLeastUsers('-'));
 if (BitField.has(128)) Rules.push(lan.channelRules.MentionsMostUsers('-'));
 if (BitField.has(256)) Rules.push(lan.channelRules.MentionsLeastChannels('-'));
 if (BitField.has(512)) Rules.push(lan.channelRules.MentionsMostChannels('-'));
 if (BitField.has(1024)) Rules.push(lan.channelRules.MentionsLeastRoles('-'));
 if (BitField.has(2048)) Rules.push(lan.channelRules.MentionsMostRoles('-'));
 if (BitField.has(4096)) Rules.push(lan.channelRules.HasMostCharacters('-'));
 if (BitField.has(8192)) Rules.push(lan.channelRules.HasMostLinks('-'));
 if (BitField.has(16384)) Rules.push(lan.channelRules.HasLeastEmotes('-'));
 if (BitField.has(32768)) Rules.push(lan.channelRules.HasMostEmotes('-'));
 if (BitField.has(65536)) Rules.push(lan.channelRules.HasLeastMentions('-'));
 if (BitField.has(131072)) Rules.push(lan.channelRules.HasMostMentions('-'));

 return Rules;
};
