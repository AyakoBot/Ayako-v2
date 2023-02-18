import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['disboard-reminders'];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['disboard-reminders']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.disboard[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: getEmbeds(embedParsers, settings, language, lan),
    components: getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds = (
  embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
  settings: DBT.disboard | null,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['disboard-reminders'],
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
        name: lan.fields.deletereply.name,
        value: embedParsers.boolean(settings?.deletereply, language),
        inline: true,
      },
      {
        name: lan.fields.channelid.name,
        value: embedParsers.channel(settings?.channelid, language),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.repeatenabled.name,
        value: embedParsers.boolean(settings?.repeatenabled, language),
        inline: true,
      },
      {
        name: lan.fields.repeatreminder.name,
        value: embedParsers.time(Number(settings?.repeatreminder), language),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.roles.name,
        value: embedParsers.roles(settings?.roles, language),
        inline: true,
      },
      {
        name: lan.fields.users.name,
        value: embedParsers.users(settings?.users, language),
        inline: true,
      },
    ],
  },
];

export const getComponents = (
  buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
  settings: DBT.disboard | null,
  language: CT.Language,
  name: 'disboard-reminders' = 'disboard-reminders',
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.deletereply, 'deletereply', name),
      buttonParsers.specific(language, settings?.channelid, 'channelid', name, 'channel'),
      buttonParsers.boolean(language, settings?.repeatenabled, 'repeatenabled', name),
      buttonParsers.specific(language, settings?.repeatreminder, 'repeatreminder', name),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.roles, 'roles', name, 'role'),
      buttonParsers.specific(language, settings?.users, 'users', name, 'user'),
    ],
  },
];
