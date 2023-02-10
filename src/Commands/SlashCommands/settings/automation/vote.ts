import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const subcommandName = cmd.options.data
    .find((c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup)
    ?.options?.find((c) => c.type === Discord.ApplicationCommandOptionType.Subcommand)?.name;
  if (!subcommandName) throw new Error('No Sub-Command Name found');
  const { embedParsers, buttonParsers } = client.ch.settingsHelpers;

  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.vote} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.votesettings[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.vote;
  const name = 'vote';

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
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
      components: [buttonParsers.global(language, !!settings?.active, name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.token, 'token', name),
        buttonParsers.specific(language, settings?.reminders, 'reminders', name),
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
