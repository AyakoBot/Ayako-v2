import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['self-roles'];

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
  lan: CT.Language['slashCommands']['settings']['categories']['self-roles'],
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['self-roles']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.selfroles[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['self-roles'],
) => {
  const name = 'self-roles';
  const { multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['self-roles']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.selfroles[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.name.name}: \`${s.name ?? language.none}\``,
    value: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  }));

  const embeds = multiRowHelpers.embeds(fields, language, lan);
  const components = multiRowHelpers.options(language, name);
  multiRowHelpers.noFields(embeds, language);
  multiRowHelpers.components(embeds, components, language, name);

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<'self-roles'>['getEmbeds'] = (
  embedParsers,
  settings,
  language,
  lan,
) => [
  {
    author: embedParsers.author(language, lan),
    fields: [
      {
        name: language.slashCommands.settings.active,
        value: embedParsers.boolean(settings?.active, language),
        inline: false,
      },
      {
        name: lan.fields.name.name,
        value: settings?.name ?? language.none,
        inline: true,
      },
      {
        name: lan.fields.onlyone.name,
        value: embedParsers.boolean(settings?.onlyone, language),
        inline: true,
      },
      {
        name: lan.fields.roles.name,
        value: embedParsers.roles(settings?.roles, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.blrole,
        value: embedParsers.roles(settings?.blroles, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.bluser,
        value: embedParsers.roles(settings?.blusers, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.wlrole,
        value: embedParsers.roles(settings?.wlroles, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.wluser,
        value: embedParsers.roles(settings?.wlusers, language),
        inline: false,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<'self-roles'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'self-roles',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.name, 'name', name),
      buttonParsers.boolean(language, settings?.onlyone, 'onlyone', name),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.name, 'name', name),
      buttonParsers.boolean(language, settings?.onlyone, 'onlyone', name),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.roles, 'roles', name, 'role'),
      buttonParsers.global(language, settings?.blroles, 'blroleid', name),
      buttonParsers.global(language, settings?.blusers, 'bluserid', name),
      buttonParsers.global(language, settings?.wlroles, 'wlroleid', name),
      buttonParsers.global(language, settings?.wlusers, 'wluserid', name),
    ],
  },
];
