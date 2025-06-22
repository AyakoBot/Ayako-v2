import {
 ComponentType,
 SelectMenuDefaultValueType,
 type APIEmbed,
 type ChatInputCommandInteraction,
} from 'discord.js';
import { getMaxShare } from '../../../Commands/SelectCommands/UserSelect/custom-role/share.js';

export default async (cmd: ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.customRole;

 const maxShare = await getMaxShare(cmd);
 if (!maxShare) return;

 const embed: APIEmbed = {
  author: { name: lan.share.title },
  description: lan.share.desc(Number(maxShare)),
  color: cmd.client.util.Colors.Ephemeral,
 };

 const role = await cmd.client.util.DataBase.customroles.findUnique({
  where: { guildid_userid: { guildid: cmd.guildId, userid: cmd.user.id } },
 });
 if (!role) {
  cmd.client.util.errorCmd(cmd, lan.share.noRole, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  embeds: [embed],
  components: [
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.UserSelect,
      customId: 'custom-role/share',
      placeholder: lan.share.placeholder,
      minValues: 0,
      maxValues: maxShare,
      defaultValues: role.shared.map((id) => ({ type: SelectMenuDefaultValueType.User, id })),
      disabled: Number(maxShare) < 1,
     },
    ],
   },
  ],
 });
};
