import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const punishmentId = cmd.options.getString('id', true);
 const punishment = await cmd.client.util.getPunishment(Number.parseInt(punishmentId, 36));
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.edit;
 if (!punishment) {
  cmd.client.util.errorCmd(cmd, lan.invalid, language);
  return;
 }

 const reason = cmd.options.getString('reason', true);

 switch (punishment.type) {
  case CT.PunishmentType.Ban:
   cmd.client.util.DataBase.punish_bans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case CT.PunishmentType.Channelban:
   cmd.client.util.DataBase.punish_channelbans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case CT.PunishmentType.Kick:
   cmd.client.util.DataBase.punish_kicks
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case CT.PunishmentType.Mute:
   cmd.client.util.DataBase.punish_mutes
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case CT.PunishmentType.Tempban:
   cmd.client.util.DataBase.punish_tempbans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case CT.PunishmentType.Tempchannelban:
   cmd.client.util.DataBase.punish_tempchannelbans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case CT.PunishmentType.Tempmute:
   cmd.client.util.DataBase.punish_tempmutes
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case CT.PunishmentType.Warn:
   cmd.client.util.DataBase.punish_warns
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  default:
   break;
 }

 const target = await cmd.client.util.getUser(punishment.userid);
 if (!target) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  description: lan.desc(cmd.user, target, Number(punishment.uniquetimestamp).toString(36)),
  fields: [
   {
    name: language.t.Reason,
    value: reason,
   },
  ],
  color: CT.Colors.Loading,
 };

 const logchannels = await cmd.client.util.getLogChannels('modlog', cmd.guild);
 if (logchannels?.length) {
  cmd.client.util.send({ guildId: cmd.guildId, id: logchannels }, { embeds: [embed] }, 10000);
 }

 cmd.client.util.replyCmd(cmd, { content: lan.success });
};
