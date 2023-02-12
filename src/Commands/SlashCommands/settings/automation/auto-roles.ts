import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = client.ch.settingsHelpers;

  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['auto-roles']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.autoroles[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories['auto-roles'];
  const name = 'auto-roles';

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
          name: lan.fields.botroleid.name,
          value: embedParsers.roles(settings?.botroleid, language),
          inline: true,
        },
        {
          name: lan.fields.userroleid.name,
          value: embedParsers.roles(settings?.userroleid, language),
          inline: true,
        },
        {
          name: lan.fields.allroleid.name,
          value: embedParsers.roles(settings?.allroleid, language),
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
        buttonParsers.specific(language, settings?.botroleid, 'botroleid', name, 'role'),
        buttonParsers.specific(language, settings?.userroleid, 'userroleid', name, 'role'),
        buttonParsers.specific(language, settings?.allroleid, 'allroleid', name, 'role'),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
