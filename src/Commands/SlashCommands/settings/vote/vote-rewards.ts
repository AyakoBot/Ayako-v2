import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['vote-rewards'];

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
  lan: CT.Language['slashCommands']['settings']['categories']['vote-rewards'],
) => {
  const { buttonParsers, embedParsers } = client.ch.settingsHelpers;
  const name = 'vote-rewards';
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['vote-rewards']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.voterewards[] | null) => (r ? r[0] : null));

  const embeds: Discord.APIEmbed[] = [
    {
      author: embedParsers.author(language, lan),
      fields: [
        {
          name: lan.fields.tier.name,
          value: embedParsers.number(settings?.tier, language),
          inline: true,
        },
      ],
    },
  ];

  let typeField = {
    name: lan.fields.tier.name,
    value: settings?.rewardtype
      ? lan.rewardTypes[settings.rewardtype as keyof typeof lan.rewardTypes]
      : '\u200b',
    inline: true,
  };

  let rewardField = {
    name: '\u200b',
    value: '\u200b',
    inline: false,
  };

  switch (settings?.rewardtype) {
    case 'role': {
      rewardField = {
        name: lan.fields.reward.name,
        value: embedParsers.role(settings?.reward, language),
        inline: true,
      };
      break;
    }
    case 'currency':
    case 'xpmultiplier':
    case 'xp': {
      rewardField = {
        name: lan.fields.reward.name,
        value: embedParsers.number(settings?.reward, language),
        inline: true,
      };
      break;
    }
    default: {
      typeField = {
        name: lan.fields.rewardtype.name,
        value: language.none,
        inline: true,
      };
    }
  }

  embeds[0].fields?.push(typeField);
  if (rewardField.inline) embeds[0].fields?.push(rewardField);

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, String(settings?.tier), 'tier', name),
        buttonParsers.specific(language, settings?.rewardtype, 'rewardtype', name),
        buttonParsers.specific(language, settings?.reward, 'reward', name),
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
  lan: CT.Language['slashCommands']['settings']['categories']['vote-rewards'],
) => {
  const name = 'vote-rewards';
  const { multiRowHelpers } = client.ch.settingsHelpers;
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['vote-rewards']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.voterewards[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.tier.name}: \`${s.tier ?? language.none}\` - ${
      lan.fields.rewardtype.name
    }: ${
      s.rewardtype ? lan.rewardTypes[s.rewardtype as keyof typeof lan.rewardTypes] : language.none
    }`,
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
