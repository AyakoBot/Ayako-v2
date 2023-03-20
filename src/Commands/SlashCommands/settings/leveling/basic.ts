import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'leveling';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then(async (r: CT.TableNamesMap[typeof name][] | null) =>
      r ? r[0] : await ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name),
    );

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const getLevelUpMode = (
  type: string | undefined,
  lan: CT.Language['slashCommands']['settings']['categories'][typeof name],
) => {
  switch (type) {
    case '1': {
      return lan.messages;
    }
    case '2': {
      return lan.reactions;
    }
    default: {
      return lan.silent;
    }
  }
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
  embedParsers,
  settings,
  language,
  lan,
) => {
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
          name: lan.fields.xppermsg.name,
          value: embedParsers.number(settings?.xppermsg, language),
          inline: true,
        },
        {
          name: lan.fields.xpmultiplier.name,
          value: embedParsers.number(settings?.xpmultiplier, language),
          inline: true,
        },
        {
          name: lan.fields.rolemode.name,
          value: settings?.rolemode ? language.rolemodes.replace : language.rolemodes.stack,
          inline: true,
        },
        {
          name: lan.fields.lvlupmode.name,
          value: getLevelUpMode(settings?.lvlupmode, lan),
          inline: true,
        },
      ],
    },
  ];

  switch (settings?.lvlupmode) {
    case '1': {
      embeds[0].fields?.push(
        {
          name: lan.fields.embed.name,
          value: await embedParsers.embed(settings?.embed, language),
          inline: true,
        },
        {
          name: lan.fields.lvlupdeltimeout.name,
          value: embedParsers.time(Number(settings?.lvlupdeltimeout), language),
          inline: true,
        },
        {
          name: lan.fields.lvlupchannels.name,
          value: embedParsers.channels(settings?.lvlupchannels, language),
          inline: false,
        },
      );

      break;
    }
    case '2': {
      embeds[0].fields?.push(
        {
          name: lan.fields.lvlupemotes.name,
          value: settings?.lvlupemotes?.length
            ? (await Promise.all(settings.lvlupemotes.map((e) => ch.getEmote(e))))
                .filter((e): e is Discord.GuildEmoji => !!e)
                .join(', ')
            : ch.stringEmotes.levelupemotes.join(', '),
          inline: true,
        },
        {
          name: lan.fields.lvlupdeltimeout.name,
          value: embedParsers.time(Number(settings?.lvlupdeltimeout), language),
          inline: true,
        },
      );

      break;
    }
    default: {
      break;
    }
  }

  embeds[0].fields?.push(
    {
      name: lan.fields.ignoreprefixes.name,
      value: embedParsers.boolean(settings?.ignoreprefixes, language),
      inline: true,
    },
    {
      name: lan.fields.prefixes.name,
      value: settings?.prefixes?.length
        ? settings.prefixes.map((p) => `\`${p}\``).join(', ')
        : language.None,
      inline: true,
    },
    {
      name: language.slashCommands.settings.blchannel,
      value: embedParsers.channels(settings?.blchannels, language),
      inline: false,
    },
    {
      name: language.slashCommands.settings.wlchannel,
      value: embedParsers.channels(settings?.wlchannels, language),
      inline: false,
    },
    {
      name: language.slashCommands.settings.blrole,
      value: embedParsers.channels(settings?.blroles, language),
      inline: false,
    },
    {
      name: language.slashCommands.settings.wlrole,
      value: embedParsers.channels(settings?.wlroles, language),
      inline: false,
    },
    {
      name: language.slashCommands.settings.bluser,
      value: embedParsers.channels(settings?.blusers, language),
      inline: false,
    },
    {
      name: language.slashCommands.settings.wluser,
      value: embedParsers.channels(settings?.wlusers, language),
      inline: false,
    },
  );

  return embeds;
};

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
  buttonParsers,
  settings,
  language,
) => {
  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.global(language, !!settings?.active, 'active', name, undefined)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.xppermsg, 'xppermsg', name, undefined),
        buttonParsers.specific(language, settings?.xpmultiplier, 'xpmultiplier', name, undefined),
        buttonParsers.specific(language, settings?.rolemode, 'rolemode', name, undefined),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.lvlupmode, 'lvlupmode', name, undefined),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.boolean(
          language,
          settings?.ignoreprefixes,
          'ignoreprefixes',
          name,
          undefined,
        ),
        buttonParsers.specific(language, settings?.prefixes, 'prefixes', name, undefined),
        buttonParsers.global(language, settings?.blchannels, 'blchannelid', name, undefined),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.global(language, settings?.blroles, 'blroleid', name, undefined),
        buttonParsers.global(language, settings?.blusers, 'bluserid', name, undefined),
        buttonParsers.global(language, settings?.wlchannels, 'wlchannelid', name, undefined),
        buttonParsers.global(language, settings?.wlroles, 'wlroleid', name, undefined),
        buttonParsers.global(language, settings?.wlusers, 'wluserid', name, undefined),
      ],
    },
  ];

  switch (settings?.lvlupmode) {
    case '1': {
      components[2].components.push(
        buttonParsers.specific(language, settings?.embed, 'embed', name, undefined),
        buttonParsers.specific(
          language,
          settings?.lvlupdeltimeout,
          'lvlupdeltimeout',
          name,
          undefined,
        ),
        buttonParsers.specific(
          language,
          settings?.lvlupchannels,
          'lvlupchannels',
          name,
          undefined,
          'channel',
        ),
      );
      break;
    }
    case '2': {
      components[2].components.push(
        buttonParsers.specific(language, settings?.lvlupemotes, 'lvlupemotes', name, undefined),
        buttonParsers.specific(
          language,
          settings?.lvlupdeltimeout,
          'lvlupdeltimeout',
          name,
          undefined,
        ),
      );
      break;
    }
    default: {
      break;
    }
  }

  return components;
};
