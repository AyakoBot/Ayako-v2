import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories.leveling;
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.leveling} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.leveling[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const getLevelUpMode = (
  type: string | undefined,
  lan: CT.Language['slashCommands']['settings']['categories']['leveling'],
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

export const getEmbeds = async (
  embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
  settings: DBT.leveling | null,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['leveling'],
): Promise<Discord.APIEmbed[]> => {
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
          value: settings?.rolemode
            ? language.slashCommands.settings.replace
            : language.slashCommands.settings.stack,
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
        : language.none,
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

export const getComponents = (
  buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
  settings: DBT.leveling | null,
  language: CT.Language,
  name: 'leveling' = 'leveling',
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => {
  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.xppermsg, 'xppermsg', name),
        buttonParsers.specific(language, settings?.xpmultiplier, 'xpmultiplier', name),
        buttonParsers.specific(language, settings?.rolemode, 'rolemode', name),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.specific(language, settings?.lvlupmode, 'lvlupmode', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.boolean(language, settings?.ignoreprefixes, 'ignoreprefixes', name),
        buttonParsers.specific(language, settings?.prefixes, 'prefixes', name),
        buttonParsers.global(language, settings?.blchannels, 'blchannels', name),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.global(language, settings?.blroles, 'blroles', name),
        buttonParsers.global(language, settings?.blusers, 'blusers', name),
        buttonParsers.global(language, settings?.wlchannels, 'wlchannels', name),
        buttonParsers.global(language, settings?.wlroles, 'wlroles', name),
        buttonParsers.global(language, settings?.wlusers, 'wlusers', name),
      ],
    },
  ];

  switch (settings?.lvlupmode) {
    case '1': {
      components[2].components.push(
        buttonParsers.specific(language, settings?.embed, 'embed', name),
        buttonParsers.specific(language, settings?.lvlupdeltimeout, 'lvlupdeltimeout', name),
        buttonParsers.specific(language, settings?.lvlupchannels, 'lvlupchannels', name, 'channel'),
      );
      break;
    }
    case '2': {
      components[2].components.push(
        buttonParsers.specific(language, settings?.lvlupemotes, 'lvlupemotes', name),
        buttonParsers.specific(language, settings?.lvlupdeltimeout, 'lvlupdeltimeout', name),
      );
      break;
    }
    default: {
      break;
    }
  }

  return components;
};
