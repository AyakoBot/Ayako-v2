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
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.welcome} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.welcome[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.welcome;
  const name = 'welcome';

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
