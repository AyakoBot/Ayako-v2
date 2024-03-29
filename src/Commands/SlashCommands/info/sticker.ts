import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

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
 const language = await cmd.client.util.getLanguage(cmd.locale);

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
  const message = await cmd.client.util.getMessage(messageLinkOrStickerID);
  if (!message) {
   cmd.client.util.errorCmd(cmd, language.errors.messageNotFound, language);
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
  cmd.client.util.errorCmd(cmd, language.errors.stickerNotFound, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { embeds: await getEmbeds(stickers, cmd, language) });
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
     emoji: cmd.client.util.emotes.back,
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
     emoji: cmd.client.util.emotes.forth,
     disabled: page === Math.ceil(cmd.guild.stickers.cache.size / 10),
    },
   ],
  },
 ];

 if (cmd instanceof Discord.ButtonInteraction) {
  cmd.update({ embeds, components });
  return;
 }

 cmd.client.util.replyCmd(cmd, { embeds, components });
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
 const color = cmd.client.util.getColor(
  cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
 );

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
        name: `${cmd.client.util.util.makeBold(language.t.name)}:`,
        value: `${cmd.client.util.util.makeInlineCode(sticker.name)}`,
       }
     : undefined,
    sticker.description
     ? {
        name: `${cmd.client.util.util.makeBold(language.t.Description)}:`,
        value: `${cmd.client.util.util.makeInlineCode(sticker.description)}`,
       }
     : undefined,
    sticker.id
     ? {
        name: `${cmd.client.util.util.makeBold('ID')}:`,
        value: `${cmd.client.util.util.makeInlineCode(sticker.id)}`,
       }
     : undefined,
    sticker.url
     ? {
        name: `${cmd.client.util.util.makeBold('URL')}:`,
        value: sticker.url,
       }
     : undefined,
    sticker.createdTimestamp
     ? {
        name: `${cmd.client.util.util.makeBold(language.t.createdAt)}:`,
        value: `${cmd.client.util.constants.standard.getTime(sticker.createdTimestamp)}`,
       }
     : undefined,
    {
     name: `${cmd.client.util.util.makeBold(language.slashCommands.info.emojis.available)}:`,
     value: `${cmd.client.util.settingsHelpers.embedParsers.boolean(
      !!sticker.available,
      language,
     )}`,
    },
    sticker.guild
     ? {
        name: `\n${cmd.client.util.util.makeBold(language.t.Server)}:\n`,
        value: language.languageFunction.getGuild(sticker.guild),
       }
     : undefined,
    sticker.user
     ? {
        name: `${cmd.client.util.util.makeBold(language.slashCommands.info.emojis.uploader)}:\n`,
        value: language.languageFunction.getUser(sticker.user),
       }
     : undefined,
    sticker.format
     ? {
        name: `${cmd.client.util.util.makeBold(lan.formatName)}: `,
        value: `${cmd.client.util.util.makeInlineCode(Discord.StickerFormatType[sticker.format])}`,
       }
     : undefined,
    emoji
     ? {
        name: `${cmd.client.util.util.makeBold(lan.tags)}: `,
        value: `${cmd.client.util.constants.standard.getEmote(emoji)}`,
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
             name: `${cmd.client.util.util.makeBold(language.t.name)}:`,
             value: `${cmd.client.util.util.makeInlineCode(pack.name)}`,
            }
          : undefined,
         pack.description
          ? {
             name: `${cmd.client.util.util.makeBold(language.t.Description)}:`,
             value: `${cmd.client.util.util.makeInlineCode(pack.description)}`,
            }
          : undefined,
         pack.id
          ? {
             name: `${cmd.client.util.util.makeBold('ID')}:`,
             value: `${cmd.client.util.util.makeInlineCode(pack.id)}`,
            }
          : undefined,
         pack.createdTimestamp
          ? {
             name: `${cmd.client.util.util.makeBold(language.t.createdAt)}:`,
             value: `${cmd.client.util.constants.standard.getTime(pack.createdTimestamp)}`,
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
