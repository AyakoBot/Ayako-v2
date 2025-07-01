import * as Discord from 'discord.js';

export default {
 prefix: 'h!',
 invite:
  'https://discord.com/api/oauth2/authorize?client_id=650691698409734151&permissions=1642787630327&scope=bot%20applications.commands',
 image: 'https://ayakobot.com/DefaultEmbedImage',
 support: 'https://discord.gg/euTdctganf',
 permissionsViewer: (permission: bigint) => `https://discordapi.com/permissions.html#${permission}`,
 patreon: 'https://www.patreon.com/Lars_und_so',
 error: 'https://cdn.ayakobot.com/Ayako_Assets/Warning.png',
 appURL: (user: Discord.User) => `discord://-/users/${user.id}`,
 userURL: (user: Discord.User) => `https://discord.com/users/${user.id}`,
 emoteURL: (emote: Discord.Emoji) =>
  `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=4096`,
 getEmote: (
  emoji:
   | Discord.Emoji
   | { name: string | undefined; id?: string | null | undefined; animated?: boolean | null }
   | null
   | undefined,
 ) =>
  emoji
   ? (emoji.id && `<${emoji.animated ? 'a:' : ':'}${emoji.name}:${emoji.id}>`) ||
     `${/\w/g.test(emoji.name ?? '') ? `:${emoji.name}:` : emoji.name}`
   : undefined,
 getTime: (time: number) =>
  `<t:${String(time).slice(0, -3)}:f> (<t:${String(time).slice(0, -3)}:R>)`,
 msgurl: (g: string | undefined | null, c: string, m: string) =>
  `https://discord.com/channels/${g ?? '@me'}/${c}/${m}`,
 ytURL: 'https://www.youtube.com/@AyakoBot',
 user: (u: Discord.User | { discriminator: string; username: string } | Discord.PartialUser) =>
  `${u.discriminator === '0' ? u.username : `${u.username}#${u.discriminator}`}`,
 roleIconURL: (role: Discord.Role | { icon: string; id: string }) =>
  `https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.png`,
 scheduledEventImageUrl: (guildId: string, hash: string) =>
  `https://cdn.discordapp.com/guild-events/${guildId}/${hash}`,
 discoverySplashURL: (guildId: string, hash: string) =>
  `https://cdn.discordapp.com/discovery-splashes/${guildId}/${hash}.png`,
 splashURL: (guildId: string, hash: string) =>
  `https://cdn.discordapp.com/splashes/${guildId}/${hash}.png`,
 bannerURL: (guildId: string, hash: string) =>
  `https://cdn.discordapp.com/banners/${guildId}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}`,
 guildBannerURL: (guildId: string, userId: string, hash: string) =>
  `https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/banners/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}`,
 webhookAvatarURL: (webhookId: string, hash: string) =>
  `https://cdn.discordapp.com/avatars/${webhookId}/${hash}.png`,
 stickerURL: (sticker: Discord.Sticker) =>
  // eslint-disable-next-line no-nested-ternary
  `https://media.discordapp.net/stickers/${sticker.id}.${
   sticker.format === Discord.StickerFormatType.GIF
    ? 'gif'
    : (sticker.format === Discord.StickerFormatType.Lottie && 'json') || 'png'
  }`,
 getEmoteIdentifier: (
  e:
   | { animated: boolean; name: string; id: string | null | undefined }
   | Discord.GuildEmoji
   | Discord.ReactionEmoji,
 ) => `${e.animated ? 'a:' : ''}${e.name}${e.id ? `:${e.id}` : ''}`,
 getBotAddURL: (id: string) => `https://discord.com/oauth2/authorize?client_id=${id}`,
 getCommand: (cmd: Discord.ApplicationCommand<NonNullable<unknown>>): string[] => {
  if (
   !cmd.options.filter((o) =>
    [
     Discord.ApplicationCommandOptionType.SubcommandGroup,
     Discord.ApplicationCommandOptionType.Subcommand,
    ].includes(o.type),
   ).length
  ) {
   return [`</${cmd.name}:${cmd.id}>`];
  }

  return cmd.options
   .filter((o) =>
    [
     Discord.ApplicationCommandOptionType.SubcommandGroup,
     Discord.ApplicationCommandOptionType.Subcommand,
    ].includes(o.type),
   )
   .map((o) =>
    o.type === Discord.ApplicationCommandOptionType.SubcommandGroup
     ? o.options
        ?.filter((o2) => o2.type === Discord.ApplicationCommandOptionType.Subcommand)
        .map((o2) => `${cmd.name} ${o.name} ${o2.name}`)
     : `${cmd.name} ${o.name}`,
   )
   .filter((s) => !!s)
   .flat()
   .map((c) => `</${c}:${cmd.id}>`);
 },
};
