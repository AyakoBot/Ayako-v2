import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.CommandInteraction) => {
 const value = cmd.options.get('embed', true).value as string;

 const embedData = await ch.DataBase.customembeds.findUnique({
  where: { uniquetimestamp: value },
 });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.view['custom-embeds'];

 if (!embedData) {
  ch.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const embed = ch.getDiscordEmbed(embedData);
 const embedCode = JSON.stringify(embed, null, 2);
 const attachment = ch.txtFileWriter(embedCode);

 if (!attachment) return;

 ch.replyCmd(cmd, {
  ephemeral: true,
  files: [attachment],
 });
};
