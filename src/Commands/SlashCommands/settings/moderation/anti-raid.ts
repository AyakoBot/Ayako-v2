import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'anti-raid';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then(async (r: DBT.antiraid[] | null) =>
      r ? r[0] : await ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name),
    );

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
  embedParsers,
  settings,
  language,
  lan,
) => [
  {
    author: embedParsers.author(language, lan),
    fields: [
      {
        name: language.slashCommands.settings.active,
        value: embedParsers.boolean(settings?.active, language),
        inline: false,
      },

      {
        name: lan.fields.punishmenttof.name,
        value: embedParsers.boolean(settings?.punishmenttof, language),
        inline: true,
      },
      {
        name: lan.fields.punishment.name,
        value: settings?.punishment
          ? language.punishments[settings?.punishment as keyof typeof language.punishments]
          : language.None,
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.posttof.name,
        value: embedParsers.boolean(settings?.posttof, language),
        inline: true,
      },
      {
        name: lan.fields.postchannel.name,
        value: embedParsers.channel(settings?.postchannel, language),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.time.name,
        value: embedParsers.number(settings?.time, language),
        inline: true,
      },
      {
        name: lan.fields.jointhreshold.name,
        value: embedParsers.number(settings?.jointhreshold, language),
        inline: true,
      },

      {
        name: lan.fields.pingroles.name,
        value: embedParsers.roles(settings?.pingroles, language),
        inline: false,
      },
      {
        name: lan.fields.pingusers.name,
        value: embedParsers.users(settings?.pingusers, language),
        inline: false,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
  buttonParsers,
  settings,
  language,
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name, undefined)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.punishmenttof, 'punishmenttof', name, undefined),
      buttonParsers.specific(language, settings?.punishment, 'punishment', name, undefined),
      buttonParsers.boolean(language, settings?.posttof, 'posttof', name, undefined),
      buttonParsers.specific(
        language,
        settings?.postchannel,
        'postchannel',
        name,
        undefined,
        'channel',
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.time, 'time', name, undefined),
      buttonParsers.specific(language, settings?.jointhreshold, 'jointhreshold', name, undefined),
      buttonParsers.specific(language, settings?.pingroles, 'pingroles', name, undefined, 'role'),
      buttonParsers.specific(language, settings?.pingusers, 'pingusers', name, undefined, 'user'),
    ],
  },
];
