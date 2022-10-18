import Discord from 'discord.js';

// eslint-disable-next-line no-shadow
export declare enum ActivityFlags {
  'HasLeastAttachments' = 1,
  'HasMostAttachments' = 2,
  'HasLeastCharacters' = 4,
  'HasMostCharacters' = 8,
  'HasLeastWords' = 16,
  'HasMostWords' = 32,
  'MentionsLeastUsers' = 64,
  'MentionsMostUsers' = 128,
  'MentionsLeastChannels' = 256,
  'MentionsMostChannels' = 512,
  'MentionsLeastRoles' = 1024,
  'MentionsMostRoles' = 2048,
  'HasLeastLinks' = 4096,
  'HasMostLinks' = 8192,
  'HasLeastEmotes' = 16384,
  'HasMostEmotes' = 32768,
  'HasLeastMentions' = 65536,
  'HasMostMentions' = 131072,
}

export default class ChannelRules extends Discord.BitField<keyof typeof ActivityFlags> {
  All: unknown;
  defaultBit: bigint;

  static Flags = {
    HasLeastAttachments: 1 << 0,
    HasMostAttachments: 1 << 1,
    HasLeastCharacters: 1 << 2,
    HasMostCharacters: 1 << 3,
    HasLeastWords: 1 << 4,
    HasMostWords: 1 << 5,
    MentionsLeastUsers: 1 << 6,
    MentionsMostUsers: 1 << 7,
    MentionsLeastChannels: 1 << 8,
    MentionsMostChannels: 1 << 9,
    MentionsLeastRoles: 1 << 10,
    MentionsMostRoles: 1 << 11,
    HasLeastLinks: 1 << 12,
    HasMostLinks: 1 << 13,
    HasLeastEmotes: 1 << 14,
    HasMostEmotes: 1 << 15,
    HasLeastMentions: 1 << 16,
    HasMostMentions: 1 << 17,
  };

  constructor(bits: number) {
    super(bits);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.All = Object.values(ChannelRules.Flags).reduce((all: any, p: any) => all | p, 0);
    this.defaultBit = BigInt(0);
  }
}
