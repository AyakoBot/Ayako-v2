import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories.verification;
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.verification} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.verification[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: getEmbeds(embedParsers, settings, language, lan),
    components: getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds = (
  embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
  settings: DBT.verification | null,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['verification'],
): Discord.APIEmbed[] => [
  {
    author: embedParsers.author(language, lan),
    fields: [
      {
        name: language.slashCommands.settings.active,
        value: embedParsers.boolean(settings?.active, language),
        inline: false,
      },
      {
        name: lan.fields.selfstart.name,
        value: embedParsers.boolean(settings?.selfstart, language),
        inline: true,
      },
      {
        name: lan.fields.startchannel.name,
        value: embedParsers.channel(settings?.startchannel, language),
        inline: true,
      },
      {
        name: lan.fields.logchannel.name,
        value: embedParsers.channel(settings?.logchannel, language),
        inline: true,
      },
      {
        name: lan.fields.pendingrole.name,
        value: embedParsers.role(settings?.pendingrole, language),
        inline: true,
      },
      {
        name: lan.fields.finishedrole.name,
        value: embedParsers.role(settings?.finishedrole, language),
        inline: false,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.kicktof.name,
        value: embedParsers.boolean(settings?.kicktof, language),
        inline: false,
      },
      {
        name: lan.fields.kickafter.name,
        value: embedParsers.time(Number(settings?.kickafter), language),
        inline: false,
      },
    ],
  },
];

export const getComponents = (
  buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
  settings: DBT.verification | null,
  language: CT.Language,
  name: 'verification' = 'verification',
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.selfstart, 'selfstart', name),
      buttonParsers.specific(language, settings?.startchannel, 'startchannel', name, 'channel'),
      buttonParsers.specific(language, settings?.logchannel, 'logchannel', name, 'channel'),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.pendingrole, 'pendingrole', name, 'role'),
      buttonParsers.specific(language, settings?.finishedrole, 'finishedrole', name, 'role'),
      buttonParsers.boolean(language, settings?.kicktof, 'kicktof', name),
      buttonParsers.specific(language, settings?.kickafter, 'kickafter', name),
    ],
  },
];
