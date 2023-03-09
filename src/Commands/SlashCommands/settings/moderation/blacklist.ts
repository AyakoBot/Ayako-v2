import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories.blacklist;
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.blacklist} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.blacklist[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<'blacklist'>['getEmbeds'] = (
  embedParsers,
  settings,
  language,
  lan,
) => [
  {
    author: embedParsers.author(language, lan),
    description: settings?.words?.length
      ? `${lan.fields.words.name} ${ch.util.makeCodeBlock(settings.words.join(', '))}`
      : language.None,
    fields: [
      {
        name: language.slashCommands.settings.active,
        value: embedParsers.boolean(settings?.active, language),
        inline: false,
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

export const getComponents: CT.SettingsFile<'blacklist'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'blacklist',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.specific(language, settings?.words, 'words', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(language, settings?.wlchannelid, 'wlchannelid', name),
      buttonParsers.global(language, settings?.wlroleid, 'wlroleid', name),
      buttonParsers.global(language, settings?.wluserid, 'wluserid', name),
    ],
  },
];
