import { AppealStatus } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../BaseClient/Bot/Client.js';
import * as CT from '../../Typings/Typings.js';
import { pardon } from '../SlashCommands/mod/pardon/one.js';
import { getPunishment } from '../ButtonCommands/appeals/submit.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 const reason = cmd.fields.getTextInputValue('reason');
 const punishmentid = args.shift() as string;
 const accept = args.shift() === 'accept';

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.events.appeal;

 const appeal = await cmd.client.util.DataBase.appeals.update({
  where: { punishmentid },
  data: { status: accept ? AppealStatus.accepted : AppealStatus.rejected, reason },
 });
 if (!appeal) {
  cmd.client.util.errorCmd(cmd, lan.appealNotFound, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  content: accept ? lan.acceptInstructions : lan.rejectInstructions,
  ephemeral: true,
 });

 const mainEmbed = cmd.message.embeds[0].toJSON();
 const embed = {
  title: accept ? lan.accepted : lan.rejected,
  color: accept ? CT.Colors.Success : CT.Colors.Danger,
  fields: [
   {
    name: language.t.Reason,
    value: reason || language.t.noReasonProvided,
    inline: false,
   },
  ],
 } as Discord.APIEmbed;

 cmd.client.util.request.channels.editMsg(cmd.message, {
  embeds: [mainEmbed, embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: accept ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger,
      label: accept ? lan.accepted : lan.rejected,
      disabled: true,
      custom_id: '-',
     },
    ],
   },
  ],
 });

 const punishment = await getPunishment(cmd.client, {
  guildid: appeal.guildid,
  userid: appeal.userid,
  uniquetimestamp: String(appeal.punishmentid),
 });
 if (!punishment) return;

 if (accept) {
  await client.util.DataBase.punishments.delete({
   where: { uniquetimestamp: Number(punishment.uniquetimestamp), type: punishment.type },
  });
 }

 notifyUser(
  cmd,
  {
   reason: punishment.reason,
   id: Number(punishment.uniquetimestamp),
   accept,
   targetId: appeal.userid,
   actionReason: reason,
  },
  language,
 );

 pardon(punishment as Parameters<typeof pardon>[0]);
};

const notifyUser = async (
 cmd: Discord.ModalSubmitInteraction<'cached'>,
 pun: {
  reason: string | null;
  id: number;
  accept: boolean;
  targetId: string;
  actionReason: string;
 },
 language: CT.Language,
) => {
 const embed: Discord.APIEmbed = {
  title: language.events.appeal.notifications[pun.accept ? 'accTitle' : 'rejTitle'],
  description: language.events.appeal.notifications[pun.accept ? 'accDesc' : 'rejDesc'](
   pun.id.toString(36),
  ),
  color: pun.accept ? CT.Colors.Success : CT.Colors.Danger,
  fields: [
   {
    name: language.events.appeal.notifications.punReason,
    value: pun.reason || language.t.noReasonProvided,
    inline: false,
   },
   {
    name: language.events.appeal.notifications[pun.accept ? 'accReason' : 'rejReason'],
    value: pun.actionReason || language.t.noReasonProvided,
    inline: false,
   },
  ],
 };

 const dmNotify = async () => {
  const dm = await cmd.client.util.request.users.createDM(cmd.guild, pun.targetId, cmd.client);
  if ('message' in dm) return;

  cmd.client.util.request.channels.sendMessage(cmd.guild, dm.id, { embeds: [embed] }, cmd.client);
 };

 const member = await cmd.client.util.request.guilds.getMember(cmd.guild, pun.targetId);
 if ('message' in member) {
  dmNotify();
  return;
 }

 const user = await cmd.client.util.request.users.get(cmd.guild, pun.targetId);
 if ('message' in user) return;

 cmd.client.util.notificationThread(member, { embeds: [embed] });
};
