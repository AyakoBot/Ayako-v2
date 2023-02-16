import * as Discord from 'discord.js';
import { ch } from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = ch.settingsHelpers;

  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames.vote} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then((r: DBT.votesettings[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.vote;
  const name = 'vote';

  const embeds: Discord.APIEmbed[] = [
    {
      author: embedParsers.author(language, lan),
      fields: [
        {
          name: language.slashCommands.settings.active,
          value: embedParsers.boolean(settings?.active, language),
          inline: false,
        },
        {
          name: lan.fields.token.name,
          value: settings?.token ?? language.none,
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

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.token, 'token', name),
        buttonParsers.boolean(language, settings?.reminders, 'reminders', name),
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

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
