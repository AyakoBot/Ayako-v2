import * as Discord from 'discord.js';
import { glob } from 'glob';
import type * as SlashCommands from '../../../SlashCommands/index.js';
import type * as CT from '../../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction,
 _args: string[],
 t: SlashCommands.CommandCategories,
) => {
 const type = (cmd.options.getString('type', false) ??
  t ??
  'automation') as SlashCommands.CommandCategories;
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.client.util.replyCmd(cmd, getPayload(language, type, await getCommands(cmd, type)));
};

export const getCommands = async (
 cmd: {
  client: Discord.Client<true>;
  guildId: string | null;
 },
 type: SlashCommands.CommandCategories,
) => {
 const stringCommandFiles = (await getCommand('StringCommands')).filter((c) =>
  c.endsWith(`${c.split(/\/+/g).at(-1)?.replace('.js', '')}.js`),
 );
 const stringCommandsUnfiltered = await Promise.all(stringCommandFiles.map((f) => import(f)));
 const stringCommands = stringCommandsUnfiltered.filter((c) => !!c.name);
 const fetchedCommands = cmd.client.application.commands.cache;
 const commands: string[] = [];

 const settings = cmd.guildId
  ? await cmd.client.util.DataBase.guildsettings.findUnique({ where: { guildid: cmd.guildId } })
  : undefined;

 Object.entries(cmd.client.util.importCache.SlashCommands.file.default.categories)
  .filter(([, values]) => values.includes(type))
  .forEach(([key]) => {
   const [commandName] = key.split(/_/g);
   const command = fetchedCommands?.find((o) => o.name === commandName);
   const stringCommand = stringCommands.find((c) => c.name === commandName);

   commands.push(
    `${!key.match(/\s|[A-Z]/g) ? `</${key.replace(/_/g, ' ')}:${command?.id ?? '0'}>` : key} ${
     stringCommand
      ? cmd.client.util.util.makeInlineCode(
         `${settings?.prefix ?? cmd.client.util.constants.standard.prefix}${stringCommand.name}`,
        )
      : ''
    }`,
   );
  });

 return commands;
};

export const getPayload = (
 language: CT.Language,
 type: SlashCommands.CommandCategories,
 commands: string[],
): Discord.InteractionReplyOptions => ({
 embeds: [
  {
   color: language.client.util.CT.Colors.Base,
   title:
    language.slashCommands.help.categories[
     type as keyof typeof language.slashCommands.help.categories
    ],
   author: {
    name: language.slashCommands.help.title,
   },
   description: commands.map((c) => c).join('\n'),
  },
 ],
 components: [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.StringSelect,
     custom_id: 'help/list',
     placeholder: language.slashCommands.help.selectPlaceholder,
     options: Object.values(
      language.client.util.importCache.SlashCommands.file.CommandCategories,
     ).map((value) => ({
      label:
       language.slashCommands.help.categories[
        value as keyof typeof language.slashCommands.help.categories
       ],
      value,
      default: value === type,
     })),
    },
   ],
  },
 ],
});

const getCommand = (
 type: 'SlashCommands' | 'StringCommands' | 'ContextCommands',
): Promise<string[]> =>
 glob(`${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/${type}/**/*`);
