import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['anti-spam'];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['anti-spam']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.antispam[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<'anti-spam'>['getEmbeds'] = (
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

export const getComponents: CT.SettingsFile<'anti-spam'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'anti-spam',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.msgthreshold, 'msgthreshold', name),
      buttonParsers.specific(language, settings?.dupemsgthreshold, 'dupemsgthreshold', name),
      buttonParsers.specific(language, settings?.timeout, 'timeout', name),
      buttonParsers.boolean(language, settings?.deletespam, 'deletespam', name),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(language, settings?.wlchannelid, 'wlchannels', name),
      buttonParsers.global(language, settings?.wlroleid, 'wlroles', name),
      buttonParsers.global(language, settings?.wluserid, 'wlusers', name),
    ],
  },
];
