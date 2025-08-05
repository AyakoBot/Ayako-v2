import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Leveling;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({ where: { guildid: cmd.guildId } })
  .then(
   (r) =>
    r ??
    client.util.DataBase[CT.SettingsName2TableName[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language, cmd.guild),
  files: await getFiles(settings, language),
  flags: Discord.MessageFlags.Ephemeral,
 });
};

export const getFiles: CT.SettingsFile<typeof name>['getFiles'] = (settings) => {
 const rawFile = client.util.getLevelingGraphs(settings ? Number(settings.curveModifier) : 1);

 return [new Discord.AttachmentBuilder(rawFile.attachment).setName(rawFile.name)];
};

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
): Discord.APIActionRowComponent<Discord.APIComponentInMessageActionRow>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(language, !!settings.active, CT.GlobalDescType.Active, name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings.curveModifier, 'curveModifier', name, undefined),
   buttonParsers.specific(language, settings.xpmultiplier, 'xpmultiplier', name, undefined),
   buttonParsers.specific(language, settings.formulaType, 'formulaType', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Secondary,
    custom_id: `-`,
    label: language.slashCommands.settings.categories.leveling.moreSettings,
    disabled: true,
   },
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: Object.entries(language.slashCommands.settings.categories.leveling.buttons).map(
   ([k, v]) => ({
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Secondary,
    custom_id: `settings/leveling/${k}`,
    label: v,
    emoji: getEmote(k),
   }),
  ),
 },
];

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
) => [
 {
  author: embedParsers.author(language, lan),
  description: `${lan.curve}`,
  image: {
   url: 'attachment://xp-formulas-chart.png',
  },
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings.active, language),
    inline: false,
   },
  ],
 },
];

const getEmote = (k: string) => {
 switch (k) {
  case 'level-up':
   return client.util.emotes.levelupemotes[0];
  case 'voice':
   return client.util.emotes.channelTypes[2];
  case 'text':
   return client.util.emotes.channelTypes[0];
  default:
   return client.util.emotes.settings;
 }
};
