import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'anti-spam';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then(async (r: DBT.antispam[] | null) =>
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
        name: lan.fields.msgthreshold.name,
        value: embedParsers.number(settings?.msgthreshold, language),
        inline: true,
      },
      {
        name: lan.fields.dupemsgthreshold.name,
        value: embedParsers.number(settings?.dupemsgthreshold, language),
        inline: true,
      },
      {
        name: lan.fields.timeout.name,
        value: embedParsers.number(settings?.timeout, language),
        inline: true,
      },
      {
        name: lan.fields.deletespam.name,
        value: embedParsers.boolean(settings?.deletespam, language),
        inline: true,
      },

      {
        name: language.slashCommands.settings.wlchannel,
        value: embedParsers.channels(settings?.wlchannelid, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.wlrole,
        value: embedParsers.roles(settings?.wlroleid, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.wluser,
        value: embedParsers.users(settings?.wluserid, language),
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
      buttonParsers.specific(language, settings?.msgthreshold, 'msgthreshold', name, undefined),
      buttonParsers.specific(
        language,
        settings?.dupemsgthreshold,
        'dupemsgthreshold',
        name,
        undefined,
      ),
      buttonParsers.specific(language, settings?.timeout, 'timeout', name, undefined),
      buttonParsers.boolean(language, settings?.deletespam, 'deletespam', name, undefined),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(language, settings?.wlchannelid, 'wlchannelid', name, undefined),
      buttonParsers.global(language, settings?.wlroleid, 'wlroleid', name, undefined),
      buttonParsers.global(language, settings?.wluserid, 'wluserid', name, undefined),
    ],
  },
];
