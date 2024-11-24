import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const punishmentId = cmd.options.getString('id', true);
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.edit;
 const reason = cmd.options.getString('reason', true);

 const punishment = await cmd.client.util.DataBase.punishments.update({
  where: { uniquetimestamp: Number.parseInt(punishmentId, 36) },
  data: { reason },
 });

 if (!punishment) {
  cmd.client.util.errorCmd(cmd, lan.invalid, language);
  return;
 }

 const target = await cmd.client.util.getUser(punishment.userid);
 if (!target) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const embed: Discord.APIEmbed = {
  author: { name: lan.author },
  description: lan.desc(cmd.user, target, Number(punishment.uniquetimestamp).toString(36)),
  fields: [{ name: language.t.Reason, value: reason }],
  color: CT.Colors.Loading,
 };

 const logchannels = await cmd.client.util.getLogChannels('modlog', cmd.guild);
 if (logchannels?.length) {
  cmd.client.util.send({ guildId: cmd.guildId, id: logchannels }, { embeds: [embed] }, 10000);
 }

 cmd.client.util.replyCmd(cmd, { content: lan.success });
};
