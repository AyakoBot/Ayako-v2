import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import client from '../../../BaseClient/Client.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 page?: number,
) => {
 if (
  !cmd.inGuild() &&
  !(cmd instanceof Discord.ButtonInteraction) &&
  !cmd.options.getString('emoji', false)
 ) {
  const language = await ch.languageSelector(undefined);

  ch.errorCmd(cmd, language.errors.guildCommand, language);
  return;
 }

 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
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
  ch.errorCmd(cmd, language.errors.emoteNotFound, language);
  return;
 }

 ch.replyCmd(cmd, payload);
};

const getEmotesPayload = (
 emotes: (Discord.Emoji | Discord.GuildEmoji)[],
 language: CT.Language,
 lan: CT.Language['slashCommands']['info'],
 page = 1,
): Discord.InteractionReplyOptions => {
 const chunks = ch.getChunks(
  emotes.map(
   (e) =>
    `${ch.constants.standard.getEmote(e)} / \`${e.name ?? language.None}\` / \`${
     e.id ?? language.None
    }\``,
  ),
  4096,
 );
 const chunk = chunks[page - 1];

 return {
  embeds: [
   {
    author: {
     name: lan.emojis.author,
    },
    description: chunk.join('\n'),
    color: ch.colorSelector(
     emotes.find((e): e is Discord.GuildEmoji => 'guild' in e)?.guild.members.me,
    ),
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
      emoji: ch.objectEmotes.back,
      disabled: page === 1,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/emojis_${page + 1}`,
      emoji: ch.objectEmotes.forth,
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
 client.shard?.broadcastEval(
  async (cl, { color, e, guildId }) => {
   const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);

   const emoji = e.id ? cl.emojis.cache.get(e.id) ?? e : e;
   const language = await chEval.languageSelector(guildId);
   const lan = language.slashCommands.info;

   const payload = {
    embeds: [
     {
      color: color || chEval.constants.colors.base,
      author: {
       name: lan.emojis.author,
      },
      image: emoji.id
       ? {
          url:
           'url' in emoji && emoji.url
            ? emoji.url ?? chEval.constants.standard.emoteURL(emoji as Discord.GuildEmoji)
            : chEval.constants.standard.emoteURL(emoji as Discord.GuildEmoji),
         }
       : undefined,
      description: [
       emoji.name
        ? {
           name: `${chEval.util.makeBold(language.name)}:`,
           value: `${chEval.util.makeInlineCode(emoji.name)}`,
          }
        : undefined,
       emoji.id
        ? {
           name: `${chEval.util.makeBold('ID')}:`,
           value: `${chEval.util.makeInlineCode(emoji.id)}`,
          }
        : undefined,
       emoji.id
        ? {
           name: `${chEval.util.makeBold('URL')}:`,
           value: `${
            'url' in emoji && emoji.url
             ? emoji.url ?? chEval.constants.standard.emoteURL(emoji as Discord.GuildEmoji)
             : chEval.constants.standard.emoteURL(emoji as Discord.GuildEmoji)
           }`,
          }
        : undefined,
       {
        name: `${chEval.util.makeBold(lan.emojis.animated)}:`,
        value: `${chEval.settingsHelpers.embedParsers.boolean(!!emoji.animated, language)}`,
       },
       'createdTimestamp' in emoji && emoji.createdTimestamp
        ? {
           name: `${chEval.util.makeBold(language.createdAt)}:`,
           value: `${chEval.constants.standard.getTime(emoji.createdTimestamp)}`,
          }
        : undefined,
       'available' in emoji
        ? {
           name: `${chEval.util.makeBold(lan.emojis.available)}:`,
           value: `${chEval.settingsHelpers.embedParsers.boolean(!!emoji.available, language)}`,
          }
        : undefined,
       'managed' in emoji
        ? {
           name: `${chEval.util.makeBold(lan.emojis.managed)}:`,
           value: `${chEval.settingsHelpers.embedParsers.boolean(!!emoji.managed, language)}`,
          }
        : undefined,
       'guild' in emoji && emoji.guild
        ? {
           name: `\n${chEval.util.makeBold(language.Server)}:\n`,
           value: language.languageFunction.getGuild(emoji.guild),
          }
        : undefined,
       'author' in emoji && (await emoji.fetchAuthor().catch(() => undefined))
        ? {
           name: `${chEval.util.makeBold(lan.emojis.uploader)}:\n`,
           value: language.languageFunction.getUser(emoji.author as Discord.User),
          }
        : undefined,
      ]
       .filter((v): v is { name: string; value: string } => !!v)
       .map((v) => `${v.name} ${v.value}`)
       .join('\n'),
      fields:
       'roles' in emoji && emoji.roles.cache.size
        ? [
           {
            name: lan.emojis.roles,
            value: emoji.roles.cache.map((r) => language.languageFunction.getRole(r)).join('\n'),
           },
          ]
        : undefined,
     },
    ],
   };

   return { payload, foundEmoji: e.id && cl.emojis.cache.get(e.id) };
  },
  {
   context: { guildId: guild?.id, e: { ...emote }, color: guild?.members.me?.displayColor },
  },
 );
