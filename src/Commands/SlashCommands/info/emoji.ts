import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _args: string[],
 page?: number,
) => {
 if (
  !cmd.inGuild() &&
  !(cmd instanceof Discord.ButtonInteraction) &&
  !cmd.options.getString('emoji', false)
 ) {
  const language = await client.util.getLanguage(undefined);

  client.util.errorCmd(cmd, language.errors.guildCommand, language);
  return;
 }

 const ephemeral =
  cmd instanceof Discord.ChatInputCommandInteraction
   ? (cmd.options.getBoolean('hide', false) ?? true)
   : true;
 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info;

 const emoji =
  !(cmd instanceof Discord.ButtonInteraction) && cmd.options.getString('emoji', false)
   ? Discord.parseEmoji(cmd.options.getString('emoji', true))
   : undefined;
 const emojis = cmd.guild?.emojis.cache.map((c) => c);

 const payload = await (async () => {
  if (emoji) {
   const payl = await getEmotePayloads(emoji, cmd.guild);
   return payl?.find((p) => p.foundEmoji)?.payload ?? payl?.at(0)?.payload;
  }
  return getEmotesPayload(emojis as Discord.GuildEmoji[], language, lan, page);
 })();

 if (!payload) {
  client.util.errorCmd(cmd, language.errors.emoteNotFound, language);
  return;
 }

 if (cmd instanceof Discord.ButtonInteraction) cmd.update(payload);
 else client.util.replyCmd(cmd, { ...payload, ephemeral });
};

const getEmotesPayload = async (
 emotes: (Discord.Emoji | Discord.GuildEmoji)[],
 language: CT.Language,
 lan: CT.Language['slashCommands']['info'],
 page = 1,
): Promise<CT.UsualMessagePayload> => {
 if (!emotes.length) {
  const embed: Discord.APIEmbed = {
   author: {
    name: language.t.error,
    icon_url: client.util.emotes.warning.link,
    url: client.util.constants.standard.invite,
   },
   color: CT.Colors.Danger,
   description: language.errors.emoteNotFound,
  };

  return { embeds: [embed] };
 }

 const chunks = client.util.getStringChunks(
  emotes.map(
   (e) =>
    `${client.util.constants.standard.getEmote(e)} / \`${e.name ?? language.t.None}\` / \`${
     e.id ?? language.t.None
    }\``,
  ),
  4096,
 );
 const chunk = chunks[page - 1];
 const guild = emotes.find((e): e is Discord.GuildEmoji => 'guild' in e)?.guild;

 return {
  embeds: [
   {
    author: {
     name: lan.emojis.author,
    },
    description: chunk.join('\n'),
    color: client.util.getColor(guild ? await client.util.getBotMemberFromGuild(guild) : undefined),
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/emojis_${page - 1}`,
      emoji: client.util.emotes.back,
      disabled: page === 1,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      custom_id: '-',
      disabled: true,
      label: `${page}/${chunks.length}`,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/emojis_${page + 1}`,
      emoji: client.util.emotes.forth,
      disabled: page + 1 === chunks.length,
     },
    ],
   },
  ],
 };
};

const getEmotePayloads = async (
 emote: ReturnType<typeof Discord.parseEmoji>,
 guild?: Discord.Guild | null,
) =>
 client.cluster?.broadcastEval(
  async (cl, { color, e, guildId }) => {
   const ctEval = cl.util.files['/Typings/Typings.js'];
   const emoji = e.id ? ((cl.emojis?.cache.get(e.id) as Discord.GuildEmoji | null) ?? e) : e;
   const language = await cl.util.getLanguage(guildId);
   const lan = language.slashCommands.info;

   const payload = {
    embeds: [
     {
      color: color || ctEval.Colors.Base,
      author: {
       name: lan.emojis.author,
      },
      image: emoji.id
       ? {
          url: ('url' in emoji && emoji.url
           ? (emoji.url ?? cl.util.constants.standard.emoteURL(emoji as Discord.GuildEmoji))
           : cl.util.constants.standard.emoteURL(emoji as Discord.GuildEmoji)) as string,
         }
       : undefined,
      description: [
       emoji.name
        ? {
           name: `${cl.util.util.makeBold(language.t.name)}:`,
           value: `${cl.util.util.makeInlineCode(emoji.name)}`,
          }
        : undefined,
       emoji.id
        ? {
           name: `${cl.util.util.makeBold('ID')}:`,
           value: `${cl.util.util.makeInlineCode(emoji.id)}`,
          }
        : undefined,
       emoji.id
        ? {
           name: `${cl.util.util.makeBold('URL')}:`,
           value: `${
            'url' in emoji && emoji.url
             ? (emoji.url ?? cl.util.constants.standard.emoteURL(emoji as Discord.GuildEmoji))
             : cl.util.constants.standard.emoteURL(emoji as Discord.GuildEmoji)
           }`,
          }
        : undefined,
       {
        name: `${cl.util.util.makeBold(lan.emojis.animated)}:`,
        value: `${cl.util.settingsHelpers.embedParsers.boolean(!!emoji.animated, language)}`,
       },
       'id' in emoji && emoji.id
        ? {
           name: `${cl.util.util.makeBold(language.t.createdAt)}:`,
           value: `${cl.util.constants.standard.getTime(cl.util.getUnix(emoji.id))}`,
          }
        : undefined,
       'available' in emoji
        ? {
           name: `${cl.util.util.makeBold(lan.emojis.available)}:`,
           value: `${cl.util.settingsHelpers.embedParsers.boolean(!!emoji.available, language)}`,
          }
        : undefined,
       'managed' in emoji
        ? {
           name: `${cl.util.util.makeBold(lan.emojis.managed)}:`,
           value: `${cl.util.settingsHelpers.embedParsers.boolean(!!emoji.managed, language)}`,
          }
        : undefined,
       'guild' in emoji && emoji.guild
        ? {
           name: `\n${cl.util.util.makeBold(language.t.Server)}:\n`,
           value: language.languageFunction.getGuild(emoji.guild as Discord.Guild),
          }
        : undefined,
       'author' in emoji && emoji.author
        ? {
           name: `${cl.util.util.makeBold(lan.emojis.uploader)}:\n`,
           value: language.languageFunction.getUser(emoji.author as Discord.User),
          }
        : undefined,
      ]
       .filter((v): v is { name: string; value: string } => !!v)
       .map((v) => `${v.name} ${v.value}`)
       .join('\n'),
      fields:
       'roles' in emoji && (emoji.roles as Discord.GuildEmojiRoleManager).cache.size
        ? [
           {
            name: lan.emojis.roles,
            value: (emoji.roles as Discord.GuildEmojiRoleManager).cache
             .map((r) => language.languageFunction.getRole(r))
             .join(''),
           },
          ]
        : undefined,
     },
    ],
   };

   return { payload, foundEmoji: e.id && cl.emojis.cache.get(e.id) };
  },
  {
   context: {
    guildId: guild?.id,
    e: { ...emote },
    color: guild ? (await client.util.getBotMemberFromGuild(guild)).displayColor : undefined,
   },
  },
 );
