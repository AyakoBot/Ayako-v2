import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction<'cached'>) => {
 cmd.client.util.importCache.Commands.ButtonCommands.verification.verify.file.default(cmd);

 const language = await cmd.guild.client.util.getLanguage(cmd.guildId);
 const payload =
  await cmd.client.util.importCache.Commands.SlashCommands.settings.automation.verification.file.getPayload(
   language,
   cmd.guild,
  );

 cmd.guild.client.util.request.channels.editMsg(cmd.message, {
  embeds: payload.embeds,
  content: payload.content,
  components: payload.components,
 });
};
