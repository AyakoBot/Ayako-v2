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
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['nitro-monitoring']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.nitrosettings[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories['nitro-monitoring'];
  const name = 'nitro-monitoring';

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
          name: lan.fields.logchannels.name,
          value: embedParsers.channels(settings?.logchannels, language),
          inline: true,
        },
        {
          name: lan.fields.rolemode.name,
          value: settings?.rolemode
            ? language.slashCommands.settings.replace
            : language.slashCommands.settings.stack,
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
        buttonParsers.specific(language, settings?.logchannels, 'logchannels', name, 'channel'),
        buttonParsers.specific(language, settings?.rolemode, 'rolemode', name),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
