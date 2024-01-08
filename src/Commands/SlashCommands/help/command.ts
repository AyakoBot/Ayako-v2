import * as Discord from 'discord.js';
import StringSimilarity from 'string-similarity';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const rawCommand = cmd.options.getString('command', true);
 const command =
  cmd.client.application.commands.cache.find((c) => c.name === rawCommand || c.id === rawCommand) ??
  cmd.client.application.commands.cache.find(
   (c) =>
    c.name ===
    StringSimilarity.findBestMatch(
     rawCommand,
     cmd.client.application.commands.cache.map((c2) => c2.name),
    ).bestMatch.target,
  );

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.help;

 if (!command) {
  client.util.errorCmd(cmd, language.errors.commandNotFound, language);
  return;
 }

 const fields = parseOptions(command);

 const embeds: Discord.APIEmbed[] = [
  {
   color: CT.Colors.Base,
   author: {
    name: lan.author,
   },
   title: lan.clickMe,
   url: client.util.constants.standard.support,
   description: `# ${client.util.util.makeInlineCode(command?.name ?? '')}${
    client.util.constants.commands.help[
     command?.name as keyof typeof client.util.constants.commands.help
    ] ?? command?.description
     ? `\n> ${
        client.util.constants.commands.help[
         command?.name as keyof typeof client.util.constants.commands.help
        ] ?? command?.description
       }`
     : ''
   }`,
  },
 ];

 client.util
  .getStringChunks(fields, 4096)
  .filter((c) => c.length)
  .forEach((c) => {
   embeds.push({
    description: c.join('\n'),
    color: CT.Colors.Base,
    footer: {
     text: lan.footer,
    },
   });
  });

 client.util.replyCmd(cmd, { embeds });
};

const parseOptions = (
 c: Discord.ApplicationCommandOption | Discord.ApplicationCommand,
 parentWasSubCommandGroup = false,
): string[] => {
 if (!('options' in c)) return [];

 return (
  (c.options as Discord.ApplicationCommandOption[])?.map((c1) => {
   const isSubCommandGroup = c1.type === Discord.ApplicationCommandOptionType.SubcommandGroup;

   switch (c1.type) {
    case Discord.ApplicationCommandOptionType.Subcommand:
    case Discord.ApplicationCommandOptionType.SubcommandGroup: {
     return `${
      isSubCommandGroup || !parentWasSubCommandGroup ? '### ' : '- '
     }${client.util.util.makeInlineCode(c1.name)}${
      isSubCommandGroup ? ' - ' : `\n> `
     }${client.util.util.makeBold(
      client.util.constants.commands.help[
       c1.name as keyof typeof client.util.constants.commands.help
      ] ?? c1.description,
     )}\n${parseOptions(c1, isSubCommandGroup).join('')}`;
    }
    default: {
     return `> ${client.util.util.makeInlineCode(
      `${c1.name}${'required' in c1 && c1.required ? '' : '?'}`,
     )}: ${c1.description}\n`;
    }
   }
  }) ?? []
 );
};
