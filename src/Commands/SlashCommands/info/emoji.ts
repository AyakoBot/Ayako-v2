import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import client from '../../../BaseClient/Client.js';

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
  const language = await ch.getLanguage(undefined);

  ch.errorCmd(cmd, language.errors.guildCommand, language);
  return;
 }

 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
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

 if (cmd instanceof Discord.ButtonInteraction) cmd.update(payload);
 else ch.replyCmd(cmd, payload);
};

const getEmotesPayload = async (
 emotes: (Discord.Emoji | Discord.GuildEmoji)[],
 language: CT.Language,
 lan: CT.Language['slashCommands']['info'],
 page = 1,
): Promise<CT.UsualMessagePayload> => {
 const chunks = ch.getStringChunks(
  emotes.map(
   (e) =>
    `${ch.constants.standard.getEmote(e)} / \`${e.name ?? language.t.None}\` / \`${
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
    color: ch.getColor(guild ? await ch.getBotMemberFromGuild(guild) : undefined),
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
      emoji: ch.emotes.back,
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
      emoji: ch.emotes.forth,
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
   const language = await chEval.getLanguage(guildId);
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
           name: `${chEval.util.makeBold(language.t.name)}:`,
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
           name: `${chEval.util.makeBold(language.t.createdAt)}:`,
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
           name: `\n${chEval.util.makeBold(language.t.Server)}:\n`,
           value: language.languageFunction.getGuild(emoji.guild),
          }
        : undefined,
       'author' in emoji && emoji.author
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
            value: emoji.roles.cache.map((r) => language.languageFunction.getRole(r)).join(''),
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
    color: guild ? (await ch.getBotMemberFromGuild(guild)).displayColor : undefined,
   },
  },
 );
