import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'welcome';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then((r: DBT.welcome[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
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
        name: lan.fields.channelid.name,
        value: embedParsers.channel(settings?.channelid, language),
        inline: true,
      },
      {
        name: lan.fields.embed.name,
        value: await embedParsers.embed(settings?.embed, language),
        inline: true,
      },
      {
        name: lan.fields.pingjoin.name,
        value: embedParsers.boolean(settings?.pingjoin, language),
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
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.channelid, 'channelid', name, 'channel'),
      buttonParsers.specific(language, settings?.embed, 'embed', name),
      buttonParsers.boolean(language, settings?.pingjoin, 'pingjoin', name),
      buttonParsers.specific(language, settings?.pingroles, 'pingroles', name, 'role'),
      buttonParsers.specific(language, settings?.pingusers, 'pingusers', name, 'user'),
    ],
  },
];
