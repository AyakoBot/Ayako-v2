import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Leveling;

export default async (cmd: Discord.ButtonInteraction) => {
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

 cmd.update({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  files: [],
 });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
 embedParsers,
 settings,
 language,
 lan,
): Discord.APIEmbed[] => [
 {
  author: embedParsers.author(language, lan),
  description: client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]
   ?.length
   ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
      name as keyof typeof client.util.constants.tutorials
     ].map((t) => `[${t.name}](${t.link})`)}`
   : undefined,
  fields: [
   {
    name: lan.fields.vcXpRangeBottom.name,
    value: embedParsers.number(settings.vcXpRangeBottom, language),
    inline: true,
   },
   {
    name: lan.fields.vcXpRangeTop.name,
    value: embedParsers.number(settings.vcXpRangeTop, language),
    inline: true,
   },
   {
    name: lan.fields.requireUnmute.name,
    value: embedParsers.boolean(settings.requireUnmute, language),
    inline: true,
   },
   {
    name: lan.fields.minParticipants.name,
    value: embedParsers.number(settings.minParticipants, language),
    inline: true,
   },
   {
    name: lan.fields.excludeBots.name,
    value: embedParsers.boolean(settings.excludeBots, language),
    inline: true,
   },
  ],
 },
];

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
): Discord.APIActionRowComponent<Discord.APIComponentInMessageActionRow>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(language, settings.vcXpRangeBottom, 'vcXpRangeBottom', name, undefined),
   buttonParsers.specific(language, settings.vcXpRangeTop, 'vcXpRangeTop', name, undefined),
   buttonParsers.boolean(language, settings.requireUnmute, 'requireUnmute', name, undefined),
   buttonParsers.specific(language, settings.minParticipants, 'minParticipants', name, undefined),
   buttonParsers.boolean(language, settings.excludeBots, 'excludeBots', name, undefined),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [buttonParsers.back(name, undefined)],
 },
];
