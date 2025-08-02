import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.VoteRewards;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories[name];

 const id = cmd.options.get('id', false)?.value as string;
 if (id) {
  showId(cmd, id, language, lan);
  return;
 }
 showAll(cmd, language, lan, 0);
};

export const showId: NonNullable<CT.SettingsFile<typeof name>['showId']> = async (
 cmd,
 id,
 language,
 lan,
) => {
 const { buttonParsers, embedParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({
   where: { uniquetimestamp: parseInt(id, 36) },
  })
  .then(
   (r) =>
    r ??
    (client.util.settingsHelpers.setup(
     name,
     cmd.guildId,
     client.util.settingsHelpers.getUniquetimestampFromId(id),
    ) as unknown as CT.DataBaseTables[(typeof CT.SettingsName2TableName)[typeof name]]),
  );

 if (cmd.isButton()) {
  cmd.update({
   embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
   components: await getComponents(buttonParsers, settings, language, cmd.guild),
  });
  return;
 }

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language, cmd.guild),
  ephemeral: true,
 });
};

export const showAll: NonNullable<CT.SettingsFile<typeof name>['showAll']> = async (
 cmd,
 language,
 lan,
 page,
) => {
 const { multiRowHelpers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]].findMany({
  where: { guildid: cmd.guildId },
 });

 const fields = settings.map((s) => ({
  name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\` - ${lan.fields.linkedid.name}: ${
   s?.linkedid ? Number(s.linkedid).toString(36) : language.t.None
  }`,
  value: `${lan.fields.rewardroles.name}: ${
   s.rewardroles.length ? s.rewardroles.map((c) => `<@&${c}>`).slice(0, 5) : language.t.None
  }\n ${lan.fields.rewardxp.name}: ${s.rewardxp ?? language.t.None} - ${
   lan.fields.rewardxpmultiplier.name
  }: ${s.rewardxpmultiplier ?? language.t.None} - ${lan.fields.rewardcurrency.name}: ${
   s.rewardcurrency ?? language.t.None
  }`,
 }));

 const embeds = multiRowHelpers.embeds(fields, language, lan, page);
 const components = multiRowHelpers.options(language, name);
 multiRowHelpers.noFields(embeds, language);
 multiRowHelpers.components(embeds, components, language, name, page);

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
) => {
 const embeds: Discord.APIEmbed[] = [
  {
   footer: {
    text: `ID: ${Number(settings.uniquetimestamp).toString(36)}`,
   },
   author: embedParsers.author(language, lan),
   description: client.util.constants.tutorials[
    name as keyof typeof client.util.constants.tutorials
   ]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : undefined,
   fields: [
    {
     name: language.slashCommands.settings.active,
     value: embedParsers.boolean(settings.active, language),
     inline: false,
    },
    {
     name: lan.fields.weekends.name,
     value: settings.weekends
      ? language.weekendstype[settings.weekends as keyof typeof language.weekendstype]
      : language.t.None,
     inline: true,
    },
    {
     name: lan.fields.linkedid.name,
     value: embedParsers.string(
      settings.linkedid
       ? client.util.util.makeInlineCode(Number(settings.linkedid).toString(36))
       : language.t.None,
      language,
     ),
     inline: true,
    },
    {
     name: lan.fields.rewardroles.name,
     value: embedParsers.roles(settings.rewardroles, language),
     inline: false,
    },
    {
     name: lan.fields.rewardxp.name,
     value: embedParsers.number(settings.rewardxp, language),
     inline: true,
    },
    {
     name: lan.fields.rewardxpmultiplier.name,
     value: embedParsers.number(settings.rewardxpmultiplier, language),
     inline: true,
    },
    {
     name: lan.fields.rewardcurrency.name,
     value: embedParsers.number(settings.rewardcurrency, language),
     inline: true,
    },
   ],
  },
 ];

 return embeds;
};

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
) => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.back(name, undefined),
   buttonParsers.global(
    language,
    !!settings.active,
    CT.GlobalDescType.Active,
    name,
    Number(settings.uniquetimestamp),
   ),
   buttonParsers.delete(language, name, Number(settings.uniquetimestamp)),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.weekends,
    'weekends',
    name,
    Number(settings.uniquetimestamp),
   ),
   buttonParsers.setting(
    language,
    Number(settings.linkedid).toString(36) || null,
    'linkedid',
    name,
    CT.SettingNames.Vote,
    Number(settings.uniquetimestamp),
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.rewardroles,
    'rewardroles',
    name,
    Number(settings.uniquetimestamp),
    CT.EditorTypes.Role,
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.specific(
    language,
    settings.rewardxp,
    'rewardxp',
    name,
    Number(settings.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings.rewardxpmultiplier,
    'rewardxpmultiplier',
    name,
    Number(settings.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings.rewardcurrency,
    'rewardcurrency',
    name,
    Number(settings.uniquetimestamp),
   ),
  ],
 },
];
