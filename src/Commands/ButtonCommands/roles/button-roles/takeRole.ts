import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const uniquetimestamp = args.shift();
 const buttonRoles = await ch.DataBase.buttonroles.findUnique({
  where: {
   uniquetimestamp,
   active: true,
   roles: { isEmpty: false },
   guildid: cmd.guildId,
   linkedid: { not: null },
  },
 });
 if (!buttonRoles || !buttonRoles.linkedid) {
  ch.errorCmd(cmd, language.errors.settingNotFound, language);
  return;
 }

 const settings = await ch.DataBase.buttonrolesettings.findUnique({
  where: { uniquetimestamp: buttonRoles.linkedid, guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  ch.errorCmd(cmd, language.errors.settingNotFound, language);
  return;
 }

 const relatedSettings = await ch.DataBase.buttonroles.findMany({
  where: { linkedid: settings.uniquetimestamp, active: true, roles: { isEmpty: false } },
 });

 const member = await ch.request.guilds
  .getMember(cmd.guild, cmd.user.id)
  .then((r) => ('message' in r ? undefined : r));
 if (!member) return;

 if (!member.roles.cache.hasAll(...buttonRoles.roles, ...settings.anyroles)) {
  if (settings.onlyone && relatedSettings.length) {
   ch.roleManager.add(
    member,
    relatedSettings.map((r) => r.roles).flat(),
    language.autotypes.buttonroles,
    1,
   );
  }

  ch.roleManager.add(
   member,
   [...buttonRoles.roles, ...settings.anyroles],
   language.autotypes.buttonroles,
   1,
  );
 } else {
  ch.roleManager.remove(
   member,
   [...buttonRoles.roles, ...settings.anyroles],
   language.autotypes.buttonroles,
   1,
  );
 }

 cmd.deferUpdate();
};
