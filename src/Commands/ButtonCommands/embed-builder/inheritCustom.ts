import type * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const selectedOption =
  cmd.client.util.importCache.Commands.ButtonCommands[
   'embed-builder'
  ].deleteCustom.file.getSelectedField(cmd)?.value;
 if (!selectedOption) return;

 const dbEmbed = await cmd.client.util.DataBase.customembeds.findUnique({
  where: { uniquetimestamp: selectedOption },
 });
 if (!dbEmbed) return;

 const embed = cmd.client.util.getDiscordEmbed(dbEmbed);

 cmd.client.util.importCache.Commands.ButtonCommands['embed-builder'].startOver.file.default(
  cmd,
  [],
  embed,
 );
};
