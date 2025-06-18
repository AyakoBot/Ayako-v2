import * as Discord from 'discord.js';
import { getContent } from '../../../Events/BotEvents/autoModerationActionEvents/censor.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const settings = await getSettings(cmd);
 if (!settings) return;
 const { language, lan } = settings;

 const customRole = await getCustomRole(cmd, settings, false);

 if (customRole) {
  cmd.client.util.errorCmd(
   cmd,
   `${lan.alreadyExists}\n\n${lan.limits(
    {
     icon: settings.canseticon,
     color: settings.cansetcolor,
     holo: settings.cansetholo,
     gradient: settings.cansetgradient,
    },
    await cmd.client.util.getCustomCommand(cmd.guild, 'custom-role').then((r) => r?.id || '0'),
   )}`,
   language,
  );
  return;
 }

 const name = cmd.options.getString('name', false);

 const role = await cmd.client.util.request.guilds.createRole(
  cmd.guild,
  {
   name: name
    ? await getContent(
       cmd.guild,
       name,
       undefined,
       undefined,
       undefined,
       cmd.member.roles.cache.map((r) => r),
      )
    : cmd.member.displayName,
   permissions: '0',
  },
  cmd.user.username,
 );

 if (!role || 'message' in role) {
  cmd.client.util.errorCmd(cmd, role.message, language);
  return;
 }

 cmd.client.util.roleManager.add(
  cmd.member,
  [role.id],
  language.events.guildMemberUpdate.rewards.customRoleName,
 );
 cmd.client.util.replyCmd(cmd, {
  content: `${lan.create(role)}\n\n${lan.limits(
   {
    icon: settings.canseticon,
    color: settings.cansetcolor,
    holo: settings.cansetholo,
    gradient: settings.cansetgradient,
   },
   await cmd.client.util.getCustomCommand(cmd.guild, 'custom-role').then((r) => r?.id || '0'),
  )}`,
 });

 cmd.client.util.DataBase.customroles
  .create({ data: { userid: cmd.user.id, roleid: role.id, guildid: cmd.guildId } })
  .then();

 await cmd.client.util.sleep(1000);

 const positionRole = settings.positionRoleId
  ? cmd.guild.roles.cache.get(settings.positionRoleId)
  : undefined;
 if (!positionRole) return;

 await cmd.client.util.request.guilds
  .setRolePositions(cmd.guild, [{ position: positionRole.rawPosition, id: role.id }])
  .catch((e) => console.log(e));
};

export const getSettings = async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.customRole;

 const settings = await cmd.client.util.DataBase.rolerewards.findMany({
  where: { guildid: cmd.guildId, active: true, customrole: true },
 });
 if (!settings.length) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return false;
 }

 const applyingSettings = settings.filter(
  (s) =>
   s.roles.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.blroleid.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.bluserid.includes(cmd.user.id),
 );

 if (!applyingSettings.length) {
  cmd.client.util.errorCmd(cmd, lan.cantSet, language);
  return false;
 }

 return {
  cansetcolor: applyingSettings.some((s) => s.cansetcolor),
  canseticon: applyingSettings.some((s) => s.canseticon),
  cansetholo: applyingSettings.some((s) => s.cansetholo),
  cansetgradient: applyingSettings.some((s) => s.cansetgradient),
  positionRoleId: applyingSettings.find((s) => s.positionrole)?.positionrole,
  language,
  lan,
 };
};

export const getCustomRole = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'>,
 settings: Exclude<Awaited<ReturnType<typeof getSettings>>, false>,
 errorIfNotExists: boolean = true,
) => {
 const customroleSetting = await cmd.client.util.DataBase.customroles.findUnique({
  where: { guildid_userid: { guildid: cmd.guildId, userid: cmd.user.id } },
 });
 const customRole = customroleSetting ? cmd.guild.roles.cache.get(customroleSetting.roleid) : false;

 if (!customRole && errorIfNotExists) {
  const cmdId = await cmd.client.util
   .getCustomCommand(cmd.guild, 'custom-role')
   .then((r) => r?.id || '0');

  cmd.client.util.errorCmd(
   cmd,
   `${settings.lan.notExists(cmdId)}\n\n${settings.lan.limits(
    {
     icon: settings.canseticon,
     color: settings.cansetcolor,
     holo: settings.cansetholo,
     gradient: settings.cansetgradient,
    },
    cmdId,
   )}`,
   settings.language,
  );
  return;
 }

 return customRole;
};
