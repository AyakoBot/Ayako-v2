import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = client.ch.settingsHelpers;

  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.nitro} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.nitrosettings[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.nitro;
  const name = 'nitro';

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
      components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
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
