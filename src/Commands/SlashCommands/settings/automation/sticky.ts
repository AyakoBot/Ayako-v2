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
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.sticky} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.sticky[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.sticky;
  const name = 'sticky';

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
      fields: [
        {
          name: lan.fields.stickypermsactive.name,
          value: embedParsers.boolean(settings?.stickypermsactive, language),
          inline: true,
        },
        {
          name: lan.fields.stickyrolesactive.name,
          value: embedParsers.boolean(settings?.stickyrolesactive, language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.stickyrolesmode.name,
          value: settings?.stickyrolesmode
            ? `${client.stringEmotes.enabled} ${lan.unsticky}`
            : `${client.stringEmotes.disabled} ${lan.sticky}`,
          inline: false,
        },
        {
          name: lan.fields.roles.name,
          value: embedParsers.roles(settings?.roles, language),
          inline: false,
        },
      ],
    },
  ];

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.stickypermsactive, 'stickypermsactive', name),
        buttonParsers.specific(language, settings?.stickyrolesactive, 'stickyrolesactive', name),
        buttonParsers.specific(language, settings?.stickyrolesmode, 'stickyrolesmode', name),
        buttonParsers.specific(language, settings?.roles, 'roles', name, 'role'),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
