import type { ChatInputCommandInteraction } from 'discord.js';

export default async (cmd: ChatInputCommandInteraction) => {
 const identId = cmd.inGuild() ? cmd.guildId : cmd.channelId;

 const snowball = await cmd.client.util.DataBase.event.findUnique({
  where: { identId_userId: { identId, userId: cmd.user.id } },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId ?? 'en-GB');
 const lan = language.slashCommands.event;

 if (snowball?.has) {
  cmd.reply({ content: lan.already, ephemeral: true });
  return;
 }

 await cmd.client.util.DataBase.event.upsert({
  where: { identId_userId: { identId, userId: cmd.user.id } },
  create: { identId, userId: cmd.user.id, has: true },
  update: { has: true },
 });

 cmd.reply({ content: lan.collected, ephemeral: true });
};
