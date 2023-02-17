import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = ch.settingsHelpers;

  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.basic} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.guildsettings[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.basic;
  const name = 'basic';

  const embeds: Discord.APIEmbed[] = [
    {
      author: embedParsers.author(language, lan),
      fields: [
        {
          name: lan.fields.prefix.name,
          value: settings?.prefix ? `\`${settings?.prefix}\`` : language.none,
          inline: true,
        },
        {
          name: lan.fields.interactionsmode.name,
          value: settings?.interactionsmode
            ? `${language.small} ${ch.stringEmotes.small}`
            : `${language.large} ${ch.stringEmotes.big}`,
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.lan.name,
          value: settings?.lan
            ? language.languages[settings.lan as keyof typeof language.languages]
            : language.languages.en,
          inline: true,
        },
        {
          name: lan.fields.errorchannel.name,
          value: embedParsers.channel(settings?.errorchannel, language),
          inline: true,
        },
      ],
    },
  ];

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.prefix, 'prefix', name),
        buttonParsers.specific(language, settings?.interactionsmode, 'interactionsmode', name),
        buttonParsers.specific(language, settings?.lan, 'lan', name),
        buttonParsers.specific(language, settings?.errorchannel, 'errorchannel', name),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
