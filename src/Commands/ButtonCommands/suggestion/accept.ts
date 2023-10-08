import * as Discord from 'discord.js';
import { isValid } from './tick.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, _args: [], accept = true) => {
 if (!cmd.inCachedGuild()) return;

 const valid = await isValid(cmd);
 if (!valid) return;
 const { language, lan, settings } = valid;

 if (
  settings.approverroleid.some((r) => !cmd.member.roles.cache.has(r)) ||
  (!settings.approverroleid.length &&
   !cmd.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild))
 ) {
  ch.errorCmd(cmd, language.permissions.error.you, language);
  return;
 }

 cmd.showModal({
  title: language.reason,
  custom_id: `suggestion/${accept ? 'accept' : 'reject'}_${cmd.message.id}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      placeholder: `(${language.optional})`,
      custom_id: 'paragraph',
      label: language.reason,
      required: false,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      placeholder: `(${language.optional})`,
      custom_id: 'short',
      label: lan.tldr,
      required: false,
     },
    ],
   },
  ],
 });
};
