import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['rule-channels'];

  const ID = cmd.options.get('ID', false)?.value as string;
  if (ID) {
    showID(cmd, ID, language, lan);
    return;
  }
  showAll(cmd, language, lan);
};

const showID = async (
  cmd: Discord.ChatInputCommandInteraction,
  ID: string,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['rule-channels'],
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['rule-channels']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.levelingruleschannels[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: getEmbeds(embedParsers, settings, language, lan),
    components: getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['rule-channels'],
) => {
  const name = 'rule-channels';
  const { multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['rule-channels']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.levelingruleschannels[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${ch.channelRuleCalc(Number(s.rules), language)} ${language.ChannelRules} - ${Number(
      s.channels?.length,
    )} ${language.Channels}`,
    value: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  }));

  const embeds = multiRowHelpers.embeds(fields, language, lan);
  const components = multiRowHelpers.options(language, name);
  multiRowHelpers.noFields(embeds, language);
  multiRowHelpers.components(embeds, components, language, name);

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};

export const getEmbeds = (
  embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
  settings: DBT.levelingruleschannels | null,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['rule-channels'],
): Discord.APIEmbed[] => {
  const embeds: Discord.APIEmbed[] = [
    {
      author: embedParsers.author(language, lan),
      description: settings?.rules
        ? `\`${ch.channelRuleCalc(Number(settings.rules), language).join('`\n `')}\``
        : language.none,
      fields: [
        {
          name: lan.fields.channels.name,
          value: embedParsers.channels(settings?.channels, language),
          inline: false,
        },
      ],
    },
  ];

  ch.channelRuleCalc(Number(settings?.rules), language).forEach((rule, i) => {
    const key = Object.values(language.channelRules).find((v) => v === rule);
    if (!key) return;

    const emote =
      ch.stringEmotes.numbers[String((i % 5) + 1) as keyof typeof ch.stringEmotes.numbers];

    embeds[0].fields?.push({
      name: `${emote} ${rule}`,
      value: `${lan.amount}: ${
        typeof settings?.[key as keyof typeof settings] === 'string'
          ? settings[key as keyof typeof settings]
          : language.none
      }`,
      inline: true,
    });
  });

  return embeds;
};

export const getComponents = (
  buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
  settings: DBT.levelingruleschannels | null,
  language: CT.Language,
  name: 'rule-channels' = 'rule-channels',
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.specific(language, settings?.channels, 'channels', name, 'channel')],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.hasleastattachments,
        'hasleastattachments',
        name,
        undefined,
        ch.objectEmotes.numbers[String((1 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasmostattachments,
        'hasmostattachments',
        name,
        undefined,
        ch.objectEmotes.numbers[String((2 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasleastcharacters,
        'hasleastcharacters',
        name,
        undefined,
        ch.objectEmotes.numbers[String((3 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasmostcharacters,
        'hasmostcharacters',
        name,
        undefined,
        ch.objectEmotes.numbers[String((4 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasleastwords,
        'hasleastwords',
        name,
        undefined,
        ch.objectEmotes.numbers[String((5 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.hasmostwords,
        'hasmostwords',
        name,
        undefined,
        ch.objectEmotes.numbers[String((1 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.mentionsleastusers,
        'mentionsleastusers',
        name,
        undefined,
        ch.objectEmotes.numbers[String((2 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.mentionsmostusers,
        'mentionsmostusers',
        name,
        undefined,
        ch.objectEmotes.numbers[String((3 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.mentionsleastchannels,
        'mentionsleastchannels',
        name,
        undefined,
        ch.objectEmotes.numbers[String((4 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.mentionsmostchannels,
        'mentionsmostchannels',
        name,
        undefined,
        ch.objectEmotes.numbers[String((5 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.mentionsleastroles,
        'mentionsleastroles',
        name,
        undefined,
        ch.objectEmotes.numbers[String((1 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.mentionsmostroles,
        'mentionsmostroles',
        name,
        undefined,
        ch.objectEmotes.numbers[String((2 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasleastlinks,
        'hasleastlinks',
        name,
        undefined,
        ch.objectEmotes.numbers[String((3 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasmostlinks,
        'hasmostlinks',
        name,
        undefined,
        ch.objectEmotes.numbers[String((4 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasleastemotes,
        'hasleastemotes',
        name,
        undefined,
        ch.objectEmotes.numbers[String((5 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.hasmostemotes,
        'hasmostemotes',
        name,
        undefined,
        ch.objectEmotes.numbers[String((1 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasleastmentions,
        'hasleastmentions',
        name,
        undefined,
        ch.objectEmotes.numbers[String((2 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
      buttonParsers.specific(
        language,
        settings?.hasmostmentions,
        'hasmostmentions',
        name,
        undefined,
        ch.objectEmotes.numbers[String((3 % 5) + 1) as keyof typeof ch.stringEmotes.numbers],
      ),
    ],
  },
];
