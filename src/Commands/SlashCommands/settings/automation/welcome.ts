import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = ch.settingsHelpers;

  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.welcome} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.welcome[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.welcome;
  const name = 'welcome';

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

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
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

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
