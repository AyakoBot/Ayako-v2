import type * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const value = cmd.options.get('embed', true).value as string;
 if (Number.isNaN(parseInt(value, 10))) {
  cmd.client.util.errorCmd(cmd, language.errors.inputNoMatch, language);
  return;
 }

 const embedData = await cmd.client.util.DataBase.customembeds.findUnique({
  where: { uniquetimestamp: value },
 });

 const lan = language.slashCommands.embedbuilder.view['custom-embeds'];

 if (!embedData) {
  cmd.client.util.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const embed = cmd.client.util.getDiscordEmbed(embedData);
 const embedCode = JSON.stringify(embed, null, 2);
 const attachment = cmd.client.util.txtFileWriter(embedCode);

 if (!attachment) return;

 cmd.client.util.replyCmd(cmd, {
  ephemeral: true,
  files: [attachment],
 });
};
