import { AppealStatus } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import { getPunishment } from '../../../Events/ClusterEvents/appeal.js';
import { pardon } from '../../../Commands/SlashCommands/mod/pardon/one.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[], accept: boolean = true) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.events.appeal;

 const appeal = await cmd.client.util.DataBase.appeals.update({
  where: { punishmentid: args[0] },
  data: { status: accept ? AppealStatus.accepted : AppealStatus.rejected },
 });
 if (!appeal) {
  cmd.client.util.errorCmd(cmd, lan.appealNotFound, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  content: accept ? lan.acceptInstructions : lan.rejectInstructions,
  ephemeral: true,
 });

 cmd.client.util.request.channels.editMsg(cmd.message, {
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

 const punishment = await getPunishment({
  guildId: appeal.guildid,
  userId: appeal.userid,
  punishmentId: String(appeal.punishmentid),
 });
 if (accept) await deletePunishment(args[0]);
 notifyUser(
  cmd,
  {
   reason: punishment.reason,
   id: Number(punishment.uniquetimestamp),
   accept,
   targetId: appeal.userid,
  },
  language,
 );
 pardon(punishment as Parameters<typeof pardon>[0]);
};

const deletePunishment = async (punishmentId: string) => {
 const where = { where: { uniquetimestamp: punishmentId }, select: {} };

 await client.util.DataBase.$transaction([
  client.util.DataBase.punish_bans.delete(where),
  client.util.DataBase.punish_channelbans.delete(where),
  client.util.DataBase.punish_kicks.delete(where),
  client.util.DataBase.punish_mutes.delete(where),
  client.util.DataBase.punish_warns.delete(where),
  client.util.DataBase.punish_tempchannelbans.delete(where),
  client.util.DataBase.punish_tempbans.delete(where),
  client.util.DataBase.punish_tempmutes.delete(where),
 ]);
};

const notifyUser = async (
 cmd: Discord.ButtonInteraction<'cached'>,
 pun: { reason: string | null; id: number; accept: boolean; targetId: string },
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
    name: language.t.Reason,
    value: pun.reason || language.t.noReasonProvided,
    inline: false,
   },
  ],
 };

 const dmNotify = async () => {
  const dm = await cmd.client.util.request.users.createDM(cmd.guild, pun.targetId, cmd.client);
  if ('message' in dm) return;

  cmd.client.util.request.channels.sendMessage(undefined, dm.id, { embeds: [embed] }, cmd.client);
 };

 const member = await cmd.client.util.request.guilds.getMember(cmd.guild, pun.targetId);
 if ('message' in member) return dmNotify();

 const user = await cmd.client.util.request.users.get(cmd.guild, pun.targetId);
 if ('message' in user) return;

 cmd.client.util.notificationThread(member, { embeds: [embed] });
};
