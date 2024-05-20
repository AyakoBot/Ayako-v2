import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[], accept: boolean = true) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.events.appeal;

 const settings = await cmd.client.util.DataBase.appealsettings.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 if (
  settings.reviewroleid.some((r) => !cmd.member.roles.cache.has(r)) ||
  (!settings.reviewroleid.length &&
   !cmd.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild))
 ) {
  cmd.client.util.errorCmd(cmd, language.permissions.error.you, language);
  return;
 }

 cmd.showModal({
  title: accept ? lan.accept : lan.reject,
  customId: `appeals_${args[0]}_${accept ? 'accept' : 'reject'}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      customId: `reason`,
      label: language.t.Reason,
      required: true,
      placeholder: lan.willBeShared,
     },
    ],
   },
  ],
 });
};
