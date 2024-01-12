import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const uniquetimestamp = args.shift();
 const buttonRoles = await cmd.client.util.DataBase.buttonroles.findUnique({
  where: {
   uniquetimestamp,
   active: true,
   roles: { isEmpty: false },
   guildid: cmd.guildId,
   linkedid: { not: null },
  },
 });
 if (!buttonRoles || !buttonRoles.linkedid) {
  cmd.client.util.errorCmd(cmd, language.errors.settingNotFound, language);
  return;
 }

 const settings = await cmd.client.util.DataBase.buttonrolesettings.findUnique({
  where: { uniquetimestamp: buttonRoles.linkedid, guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  cmd.client.util.errorCmd(cmd, language.errors.settingNotFound, language);
  return;
 }

 const relatedSettings = await cmd.client.util.DataBase.buttonroles.findMany({
  where: { linkedid: settings.uniquetimestamp, active: true, roles: { isEmpty: false } },
 });

 const member = await cmd.client.util.request.guilds
  .getMember(cmd.guild, cmd.user.id)
  .then((r) => ('message' in r ? undefined : r));
 if (!member) return;

 if (!member.roles.cache.hasAll(...buttonRoles.roles, ...settings.anyroles)) {
  if (settings.onlyone && relatedSettings.length) {
   cmd.client.util.roleManager.remove(
    member,
    relatedSettings
     .map((r) => r.roles)
     .flat()
     .filter((r) => !buttonRoles.roles.includes(r) && !settings.anyroles.includes(r)),
    language.autotypes.buttonroles,
    1,
   );
  }

  cmd.client.util.roleManager.add(
   member,
   [...buttonRoles.roles, ...settings.anyroles],
   language.autotypes.buttonroles,
   1,
  );
 } else {
  cmd.client.util.roleManager.remove(
   member,
   [...buttonRoles.roles, ...settings.anyroles],
   language.autotypes.buttonroles,
   1,
  );
 }

 cmd.deferUpdate();
};
