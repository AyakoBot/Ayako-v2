import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['delete-commands'];

  const ID = cmd.options.get('ID', false)?.value as string;
  if (ID) {
    showID(cmd, ID, language, lan);
    return;
  }
  showAll(cmd, language, lan);
};

const showID = async (
  cmd: Discord.ChatInputCommandInteraction,
  ID: string,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['delete-commands'],
) => {
  const { buttonParsers, embedParsers } = client.ch.settingsHelpers;
  const name = 'delete-commands';
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['delete-commands']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.deletecommands[] | null) => (r ? r[0] : null));

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
          name: lan.fields.command.name,
          value: settings?.command ?? language.none,
          inline: true,
        },
        {
          name: lan.fields.deletetimeout.name,
          value: embedParsers.time(Number(settings?.deletetimeout), language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.deletecommand.name,
          value: embedParsers.boolean(settings?.deletecommand, language),
          inline: true,
        },
        {
          name: lan.fields.deletereply.name,
          value: embedParsers.boolean(settings?.deletereply, language),
          inline: true,
        },
        {
          name: language.slashCommands.settings.wlchannel,
          value: embedParsers.channels(settings?.wlchannelid, language),
          inline: false,
        },
        {
          name: lan.fields.activechannelid.name,
          value: embedParsers.channels(settings?.activechannelid, language),
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
        buttonParsers.specific(language, settings?.command, 'command', name),
        buttonParsers.specific(language, settings?.deletetimeout, 'deletetimeout', name),
        buttonParsers.boolean(language, settings?.deletecommand, 'deletecommand', name),
        buttonParsers.boolean(language, settings?.deletereply, 'deletereply', name),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.global(language, settings?.wlchannelid, 'wlchannels', name),
        buttonParsers.specific(
          language,
          settings?.activechannelid,
          'activechannelid',
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

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['delete-commands'],
) => {
  const name = 'delete-commands';
  const { buttonParsers, embedParsers } = client.ch.settingsHelpers;
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['delete-commands']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.deletecommands[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.command.name}: \`${s.command ?? language.none}\` - ${
      lan.fields.deletetimeout
    }: \`${embedParsers.time(Number(s.deletetimeout), language)}\``,
    value: `${
      s.active ? client.stringEmotes.enabled : client.stringEmotes.disabled
    } - ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  }));

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
      fields: fields?.splice(0, 24) ?? [],
    },
  ];

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.delete(language, name), buttonParsers.create(language, name)],
    },
  ];

  if (Number(fields?.length) > 25) {
    components.unshift({
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.previous(language, name),
        buttonParsers.next(language, name, true),
      ],
    });
  }

  if (!fields?.length) {
    embeds[0].fields?.push({
      name: '\u200b',
      value: language.slashCommands.settings.noFields,
      inline: false,
    });
  }

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
