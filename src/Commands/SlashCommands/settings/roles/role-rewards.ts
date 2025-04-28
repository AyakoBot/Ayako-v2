import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.RoleRewards;

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
   components: await getComponents(buttonParsers, settings, language),
  });
  return;
 }

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
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

 const fields = settings?.map((s) => ({
  name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  value: `${lan.fields.roles.name}: ${
   s.roles.length
    ? s.roles
       .splice(0, 5)
       .map((r) => `<@&${r}>`)
       .join(', ')
    : language.t.None
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
) => [
 {
  footer: { text: `ID: ${Number(settings.uniquetimestamp).toString(36)}` },
  description: `${lan.desc}\n${
   client.util.constants.tutorials[name as keyof typeof client.util.constants.tutorials]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : ''
  }`,
  author: embedParsers.author(language, lan),
  fields: [
   {
    name: language.slashCommands.settings.active,
    value: embedParsers.boolean(settings?.active, language),
    inline: false,
   },
   {
    name: lan.fields.roles.name,
    value: embedParsers.roles(settings?.roles, language),
    inline: false,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.customrole.name,
    value: embedParsers.boolean(settings?.customrole, language),
    inline: true,
   },
   ...(settings?.customrole
    ? [
       {
        name: lan.fields.cansetcolor.name,
        value: embedParsers.boolean(settings?.cansetcolor, language),
        inline: true,
       },
       {
        name: lan.fields.canseticon.name,
        value: embedParsers.boolean(settings?.canseticon, language),
        inline: true,
       },
       {
        name: lan.fields.positionrole.name,
        value: embedParsers.role(settings?.positionrole, language),
        inline: true,
       },
       {
        name: lan.fields.maxShare.name,
        value: embedParsers.number(settings?.maxShare, language),
        inline: true,
       },
      ]
    : []),
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: lan.fields.xpmultiplier.name,
    value: embedParsers.number(settings?.xpmultiplier ?? 1, language),
    inline: true,
   },
   {
    name: lan.fields.currency.name,
    value: embedParsers.number(settings?.currency, language),
    inline: true,
   },
   {
    name: '\u200b',
    value: '\u200b',
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.blroleid,
    value: embedParsers.channels(settings?.blroleid, language),
    inline: false,
   },
   {
    name: language.slashCommands.settings.BLWL.bluserid,
    value: embedParsers.users(settings?.bluserid, language),
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
   buttonParsers.back(name, undefined),
   buttonParsers.global(
    language,
    !!settings?.active,
    CT.GlobalDescType.Active,
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.delete(language, name, Number(settings?.uniquetimestamp)),
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
    CT.EditorTypes.Role,
   ),
   buttonParsers.specific(
    language,
    settings?.xpmultiplier,
    'xpmultiplier',
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.specific(
    language,
    settings?.currency,
    'currency',
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.boolean(
    language,
    settings?.customrole,
    'customrole',
    name,
    Number(settings?.uniquetimestamp),
   ),
   ...(settings?.customrole
    ? [
       buttonParsers.boolean(
        language,
        settings?.cansetcolor,
        'cansetcolor',
        name,
        Number(settings?.uniquetimestamp),
       ),
       buttonParsers.boolean(
        language,
        settings?.canseticon,
        'canseticon',
        name,
        Number(settings?.uniquetimestamp),
       ),
       buttonParsers.specific(
        language,
        settings?.positionrole,
        'positionrole',
        name,
        Number(settings?.uniquetimestamp),
       ),
       buttonParsers.specific(
        language,
        settings?.maxShare,
        'maxShare',
        name,
        Number(settings?.uniquetimestamp),
       ),
      ]
    : []),
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   buttonParsers.global(
    language,
    settings?.blroleid,
    CT.GlobalDescType.BLRoleId,
    name,
    Number(settings?.uniquetimestamp),
   ),
   buttonParsers.global(
    language,
    settings?.bluserid,
    CT.GlobalDescType.BLUserId,
    name,
    Number(settings?.uniquetimestamp),
   ),
  ],
 },
];

export const postChange: CT.SettingsFile<typeof name>['postChange'] = async (
 oldSetting,
 newSetting,
 changedSetting,
 guild,
) => {
 if (!oldSetting || !newSetting) return;

 switch (changedSetting) {
  case 'maxShare':
   maxShare(oldSetting, newSetting, guild);
   break;
  default:
   break;
 }
};

const maxShare = async (
 oldSetting: NonNullable<Parameters<typeof postChange>[0]>,
 newSetting: NonNullable<Parameters<typeof postChange>[1]>,
 guild: Parameters<typeof postChange>[3],
) => {
 if (Number(oldSetting.maxShare) < Number(newSetting.maxShare)) return;

 const settings = await client.util.DataBase.customroles.findMany({
  where: { guildid: guild.id, shared: { isEmpty: false } },
 });
 if (!settings.length) return;

 console.log(settings);

 const tooLong = settings
  .filter((s) => s.shared.length > Number(newSetting.maxShare))
  .map((s) => {
   return {
    members: s.shared.splice(Number(newSetting.maxShare), s.shared.length),
    role: guild.roles.cache.get(s.roleid),
    newSetting: { ...s, shared: s.shared.splice(0, Number(newSetting.maxShare)) },
   };
  })
  .filter((s): s is typeof s & { role: NonNullable<(typeof s)['role']> } => !!s.role);

 if (!tooLong.length) return;
 await client.util.DataBase.$transaction(
  tooLong.map((s) =>
   client.util.DataBase.customroles.update({
    where: { guildid_userid: { guildid: guild.id, userid: s.newSetting.userid } },
    data: { shared: s.newSetting.shared },
   }),
  ),
 );

 const language = await guild.client.util.getLanguage(guild.id);

 tooLong.forEach((s) => {
  s.members.forEach((m) => {
   const member = guild.members.cache.get(m);
   if (!member) return;

   guild.client.util.roleManager.remove(member, [s.role.id], language.autotypes.customroles);
  });
 });
};
