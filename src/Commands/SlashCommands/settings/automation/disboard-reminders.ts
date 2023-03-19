import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'disboard-reminders';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then(async (r: DBT.disboard[] | null) =>
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
      buttonParsers.boolean(language, settings?.deletereply, 'deletereply', name, undefined),
      buttonParsers.specific(
        language,
        settings?.channelid,
        'channelid',
        name,
        undefined,
        'channel',
      ),
      buttonParsers.boolean(language, settings?.repeatenabled, 'repeatenabled', name, undefined),
      buttonParsers.specific(language, settings?.repeatreminder, 'repeatreminder', name, undefined),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.roles, 'roles', name, undefined, 'role'),
      buttonParsers.specific(language, settings?.users, 'users', name, undefined, 'user'),
    ],
  },
];
