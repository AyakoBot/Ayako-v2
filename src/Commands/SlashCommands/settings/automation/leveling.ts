import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.CommandInteraction | Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const subcommandName = cmd.options.data
    .find((c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup)
    ?.options?.find((c) => c.type === Discord.ApplicationCommandOptionType.Subcommand)?.name;
  if (!subcommandName) throw new Error('No Sub-Command Name found');
  const { embedParsers, buttonParsers } = client.ch.settingsHelpers;

  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.leveling} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.leveling[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.leveling;
  const name = 'leveling';

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

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.global(language, !!settings?.active, name)],
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
        buttonParsers.specific(language, settings?.ignoreprefixes, 'ignoreprefixes', name),
        buttonParsers.specific(language, settings?.prefixes, 'prefixes', name),
        buttonParsers.specific(language, settings?.blchannels, 'blchannels', name, 'channel'),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.blroles, 'blroles', name, 'role'),
        buttonParsers.specific(language, settings?.blusers, 'blusers', name, 'user'),
        buttonParsers.specific(language, settings?.wlchannels, 'wlchannels', name, 'channel'),
        buttonParsers.specific(language, settings?.wlroles, 'wlroles', name, 'role'),
        buttonParsers.specific(language, settings?.wlusers, 'wlusers', name, 'user'),
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

      components[2].components.push(
        buttonParsers.specific(language, settings?.embed, 'embed', name),
        buttonParsers.specific(language, settings?.lvlupdeltimeout, 'lvlupdeltimeout', name),
        buttonParsers.specific(language, settings?.lvlupchannels, 'lvlupchannels', name, 'channel'),
      );
      break;
    }
    case '2': {
      embeds[0].fields?.push(
        {
          name: lan.fields.lvlupemotes.name,
          value: settings?.lvlupemotes?.length
            ? settings.lvlupemotes
                .map((e) => client.emojis.cache.get(e))
                .filter((e): e is Discord.GuildEmoji => !!e)
                .join(', ')
            : client.stringEmotes.levelupemotes.join(', '),
          inline: true,
        },
        {
          name: lan.fields.lvlupdeltimeout.name,
          value: embedParsers.time(Number(settings?.lvlupdeltimeout), language),
          inline: true,
        },
      );

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

  cmd.reply({
    embeds,
    components,
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
