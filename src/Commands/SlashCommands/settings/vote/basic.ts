import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories.vote;

  const ID = cmd.options.get('id', false)?.value as string;
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
  lan: CT.Language['slashCommands']['settings']['categories']['vote'],
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.vote} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.votesettings[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['vote'],
) => {
  const name = 'vote';
  const { multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames.vote} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then((r: DBT.votesettings[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.announcementchannel.name}: ${
      s.announcementchannel ? `<#${s.announcementchannel}>` : language.None
    }`,
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

export const getEmbeds: CT.SettingsFile<'vote'>['getEmbeds'] = (
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
        name: lan.fields.reminders.name,
        value: embedParsers.boolean(settings?.reminders, language),
        inline: true,
      },
      {
        name: lan.fields.token.name,
        value: settings?.token ?? language.None,
        inline: true,
      },
      {
        name: lan.fields.announcementchannel.name,
        value: embedParsers.channel(settings?.announcementchannel, language),
        inline: true,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<'vote'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'vote',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.reminders, 'reminders', name),
      buttonParsers.specific(language, settings?.token, 'token', name),
      buttonParsers.specific(
        language,
        settings?.announcementchannel,
        'announcementchannel',
        name,
        'channel',
      ),
    ],
  },
];
