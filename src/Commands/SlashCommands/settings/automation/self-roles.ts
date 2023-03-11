import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'self-roles';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];

  const ID = cmd.options.get('id', false)?.value as string;
  if (ID) {
    showID(cmd, ID, language, lan);
    return;
  }
  showAll(cmd, language, lan);
};

export const showID: NonNullable<CT.SettingsFile<typeof name>['showID']> = async (
  cmd,
  ID,
  language,
  lan,
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.selfroles[] | null) => (r ? r[0] : null));

  if (cmd.isButton()) {
    cmd.update({
      embeds: await getEmbeds(embedParsers, settings, language, lan),
      components: await getComponents(buttonParsers, settings, language),
    });
    return;
  }

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const showAll: NonNullable<CT.SettingsFile<typeof name>['showAll']> = async (
  cmd,
  language,
  lan,
) => {
  const { multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then((r: DBT.selfroles[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.name.name}: \`${s.name ?? language.None}\``,
    value: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  }));

  const embeds = multiRowHelpers.embeds(fields, language, lan);
  const components = multiRowHelpers.options(language, name);
  multiRowHelpers.noFields(embeds, language);
  multiRowHelpers.components(embeds, components, language, name);

  if (cmd.isButton()) {
    cmd.update({
      embeds,
      components,
    });
    return;
  }
  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
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
        value: settings?.name ?? language.None,
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

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
  buttonParsers,
  settings,
  language,
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(
        language,
        !!settings?.active,
        'active',
        name,
        Number(settings?.uniquetimestamp),
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.name,
        'name',
        name,
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.boolean(
        language,
        settings?.onlyone,
        'onlyone',
        name,
        Number(settings?.uniquetimestamp),
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.name,
        'name',
        name,
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.boolean(
        language,
        settings?.onlyone,
        'onlyone',
        name,
        Number(settings?.uniquetimestamp),
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.roles,
        'roles',
        name,
        Number(settings?.uniquetimestamp),
        'role',
      ),
      buttonParsers.global(
        language,
        settings?.blroles,
        'blroleid',
        name,
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.global(
        language,
        settings?.blusers,
        'bluserid',
        name,
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.global(
        language,
        settings?.wlroles,
        'wlroleid',
        name,
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.global(
        language,
        settings?.wlusers,
        'wluserid',
        name,
        Number(settings?.uniquetimestamp),
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.back(name, undefined),
      buttonParsers.delete(language, name, Number(settings?.uniquetimestamp)),
    ],
  },
];
