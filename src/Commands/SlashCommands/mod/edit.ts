import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const punishmentId = cmd.options.getString('id', true);
 const punishment = await ch.getPunishment(Number.parseInt(punishmentId, 36));
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.edit;
 if (!punishment) {
  ch.errorCmd(cmd, lan.invalid, language);
  return;
 }

 const reason = cmd.options.getString('reason', true);

 switch (punishment.type) {
  case 'punish_bans':
   ch.DataBase.punish_bans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case 'punish_channelbans':
   ch.DataBase.punish_channelbans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case 'punish_kicks':
   ch.DataBase.punish_kicks
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case 'punish_mutes':
   ch.DataBase.punish_mutes
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case 'punish_tempbans':
   ch.DataBase.punish_tempbans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case 'punish_tempchannelbans':
   ch.DataBase.punish_tempchannelbans
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case 'punish_tempmutes':
   ch.DataBase.punish_tempmutes
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  case 'punish_warns':
   ch.DataBase.punish_warns
    .update({
     where: { uniquetimestamp: punishment.uniquetimestamp },
     data: { reason },
    })
    .then();
   break;
  default:
   break;
 }

 const target = await ch.getUser(punishment.userid);
 if (!target) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
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
  color: ch.constants.colors.loading,
 };

 const logchannels = await ch.getLogChannels('modlog', cmd.guild);
 if (logchannels?.length) {
  ch.send({ guildId: cmd.guildId, id: logchannels }, { embeds: [embed] }, 10000);
 }

 ch.replyCmd(cmd, { content: lan.success });
};
