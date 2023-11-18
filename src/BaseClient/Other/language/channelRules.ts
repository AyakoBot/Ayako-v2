import * as CT from '../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 HasLeastAttachments: (val: string | number) =>
  t.stp(t.JSON.channelRules.HasLeastAttachments, { val }),
 HasMostAttachments: (val: string | number) =>
  t.stp(t.JSON.channelRules.HasMostAttachments, { val }),
 HasLeastCharacters: (val: string | number) =>
  t.stp(t.JSON.channelRules.HasLeastCharacters, { val }),
 HasMostCharacters: (val: string | number) => t.stp(t.JSON.channelRules.HasMostCharacters, { val }),
 HasLeastWords: (val: string | number) => t.stp(t.JSON.channelRules.HasLeastWords, { val }),
 HasMostWords: (val: string | number) => t.stp(t.JSON.channelRules.HasMostWords, { val }),
 MentionsLeastUsers: (val: string | number) =>
  t.stp(t.JSON.channelRules.MentionsLeastUsers, { val }),
 MentionsMostUsers: (val: string | number) => t.stp(t.JSON.channelRules.MentionsMostUsers, { val }),
 MentionsLeastChannels: (val: string | number) =>
  t.stp(t.JSON.channelRules.MentionsLeastChannels, { val }),
 MentionsMostChannels: (val: string | number) =>
  t.stp(t.JSON.channelRules.MentionsMostChannels, { val }),
 MentionsLeastRoles: (val: string | number) =>
  t.stp(t.JSON.channelRules.MentionsLeastRoles, { val }),
 MentionsMostRoles: (val: string | number) => t.stp(t.JSON.channelRules.MentionsMostRoles, { val }),
 HasLeastLinks: (val: string | number) => t.stp(t.JSON.channelRules.HasLeastLinks, { val }),
 HasMostLinks: (val: string | number) => t.stp(t.JSON.channelRules.HasMostLinks, { val }),
 HasLeastEmotes: (val: string | number) => t.stp(t.JSON.channelRules.HasLeastEmotes, { val }),
 HasMostEmotes: (val: string | number) => t.stp(t.JSON.channelRules.HasMostEmotes, { val }),
 HasLeastMentions: (val: string | number) => t.stp(t.JSON.channelRules.HasLeastMentions, { val }),
 HasMostMentions: (val: string | number) => t.stp(t.JSON.channelRules.HasMostMentions, { val }),
});
