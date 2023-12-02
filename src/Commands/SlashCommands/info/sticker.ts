import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _args: string[],
 page?: number,
) => {
 if (!cmd.inCachedGuild()) return;

 const messageLinkOrStickerID =
  cmd instanceof Discord.ChatInputCommandInteraction
   ? cmd.options.getString('sticker', false)
   : undefined;
 const language = await ch.getLanguage(cmd.locale);

 if (messageLinkOrStickerID) single(cmd as Discord.ChatInputCommandInteraction<'cached'>, language);
 else multiple(cmd, language, page);
};

const single = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 language: CT.Language,
) => {
 let stickerIDs: string[] = [];

 const messageLinkOrStickerID = cmd.options.getString('sticker', true);

 if (messageLinkOrStickerID.includes('discord.com')) {
  const message = await ch.getMessage(messageLinkOrStickerID);
  if (!message) {
   ch.errorCmd(cmd, language.errors.messageNotFound, language);
   return;
  }

  stickerIDs = message.stickers.map((s) => s.id);
 } else {
  stickerIDs = [messageLinkOrStickerID];
 }

 const stickers = (
  await Promise.all(stickerIDs.map((s) => cmd.client.fetchSticker(s).catch(() => undefined)))
 ).filter((s): s is Discord.Sticker => !!s);
 if (!stickers.length) {
  ch.errorCmd(cmd, language.errors.stickerNotFound, language);
  return;
 }

 ch.replyCmd(cmd, { embeds: await getEmbeds(stickers, cmd, language) });
};

export const multiple = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.ButtonInteraction<'cached'>,
 language: CT.Language,
 page: number = 1,
) => {
 const embeds = await getEmbeds(
  cmd.guild.stickers.cache.map((s) => s).slice((page - 1) * 10, page * 10),
  cmd,
  language,
 );

 const components: Discord.APIActionRowComponent<Discord.APIButtonComponent>[] = [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Secondary,
     custom_id: `info/stickers_${page - 1}`,
     emoji: ch.emotes.back,
     disabled: page === 1,
    },
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Secondary,
     disabled: true,
     custom_id: '-',
     label: `${page}/${Math.ceil(cmd.guild.stickers.cache.size / 10)}`,
    },
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Secondary,
     custom_id: `info/stickers_${page + 1}`,
     emoji: ch.emotes.forth,
     disabled: page === Math.ceil(cmd.guild.stickers.cache.size / 10),
    },
   ],
  },
 ];

 if (cmd instanceof Discord.ButtonInteraction) {
  cmd.update({ embeds, components });
  return;
 }

 ch.replyCmd(cmd, { embeds, components });
};

const getEmbeds = async (
 stickers: Discord.Sticker[],
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.ButtonInteraction<'cached'>,
 language: CT.Language,
): Promise<Discord.APIEmbed[]> => {
 const lan = language.slashCommands.info.stickers;
 const packs = stickers.find((s) => s.packId)
  ? await cmd.client.fetchPremiumStickerPacks()
  : undefined;
 const color = ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined);

 return stickers.map((sticker) => {
  const pack = packs?.find((p) => p.id === sticker.packId);
  const partialEmoji = sticker.tags ? Discord.resolvePartialEmoji(sticker.tags) : undefined;
  const emoji = partialEmoji?.id
   ? sticker.guild?.emojis.cache.get(partialEmoji.id)
   : (partialEmoji as {
      name: string | undefined;
      animated: false | undefined;
      id: undefined | string;
     });

  return {
   color,
   author: {
    name: lan.author,
   },
   thumbnail: {
    url: sticker.url,
   },
   description: [
    sticker.name
     ? {
        name: `${ch.util.makeBold(language.t.name)}:`,
        value: `${ch.util.makeInlineCode(sticker.name)}`,
       }
     : undefined,
    sticker.description
     ? {
        name: `${ch.util.makeBold(language.t.Description)}:`,
        value: `${ch.util.makeInlineCode(sticker.description)}`,
       }
     : undefined,
    sticker.id
     ? {
        name: `${ch.util.makeBold('ID')}:`,
        value: `${ch.util.makeInlineCode(sticker.id)}`,
       }
     : undefined,
    sticker.url
     ? {
        name: `${ch.util.makeBold('URL')}:`,
        value: sticker.url,
       }
     : undefined,
    sticker.createdTimestamp
     ? {
        name: `${ch.util.makeBold(language.t.createdAt)}:`,
        value: `${ch.constants.standard.getTime(sticker.createdTimestamp)}`,
       }
     : undefined,
    {
     name: `${ch.util.makeBold(language.slashCommands.info.emojis.available)}:`,
     value: `${ch.settingsHelpers.embedParsers.boolean(!!sticker.available, language)}`,
    },
    sticker.guild
     ? {
        name: `\n${ch.util.makeBold(language.t.Server)}:\n`,
        value: language.languageFunction.getGuild(sticker.guild),
       }
     : undefined,
    sticker.user
     ? {
        name: `${ch.util.makeBold(language.slashCommands.info.emojis.uploader)}:\n`,
        value: language.languageFunction.getUser(sticker.user),
       }
     : undefined,
    sticker.format
     ? {
        name: `${ch.util.makeBold(lan.formatName)}: `,
        value: `${ch.util.makeInlineCode(Discord.StickerFormatType[sticker.format])}`,
       }
     : undefined,
    emoji
     ? {
        name: `${ch.util.makeBold(lan.tags)}: `,
        value: `${ch.constants.standard.getEmote(emoji)}`,
       }
     : undefined,
   ]
    .filter((v): v is { name: string; value: string } => !!v)
    .map((v) => `${v.name} ${v.value}`)
    .join('\n'),
   fields: pack
    ? [
       {
        name: lan.pack,
        value: [
         pack.name
          ? {
             name: `${ch.util.makeBold(language.t.name)}:`,
             value: `${ch.util.makeInlineCode(pack.name)}`,
            }
          : undefined,
         pack.description
          ? {
             name: `${ch.util.makeBold(language.t.Description)}:`,
             value: `${ch.util.makeInlineCode(pack.description)}`,
            }
          : undefined,
         pack.id
          ? {
             name: `${ch.util.makeBold('ID')}:`,
             value: `${ch.util.makeInlineCode(pack.id)}`,
            }
          : undefined,
         pack.createdTimestamp
          ? {
             name: `${ch.util.makeBold(language.t.createdAt)}:`,
             value: `${ch.constants.standard.getTime(pack.createdTimestamp)}`,
            }
          : undefined,
        ]
         .filter((v): v is { name: string; value: string } => !!v)
         .map((v) => `${v.name} ${v.value}`)
         .join('\n'),
       },
      ]
    : undefined,
   image:
    pack && pack.bannerId
     ? {
        url: pack.bannerURL({ size: 4096 }) as string,
       }
     : undefined,
  };
 });
};
