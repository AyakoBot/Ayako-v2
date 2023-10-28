import * as Discord from 'discord.js';
import { glob } from 'glob';
import * as ch from '../../BaseClient/ClientHelper.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isChatInputCommand()) return;
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const files = await glob(`${process.cwd()}/Commands/**/*`);

 const subcommandGroup = cmd.options.data.find(
  (c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup,
 );
 const subcommand = (subcommandGroup?.options ?? cmd.options.data).find(
  (c) => c.type === Discord.ApplicationCommandOptionType.Subcommand,
 );

 const path = () => {
  const pathArgs: string[] = [];

  if (cmd.commandName) pathArgs.push(cmd.commandName);
  if (subcommandGroup?.name) pathArgs.push(subcommandGroup?.name);
  if (subcommand?.name) pathArgs.push(subcommand?.name);

  return pathArgs.join('/');
 };

 log(path());

 const command = files.find((f) => f.endsWith(`/SlashCommands/${path()}.js`));
 if (!command) return;

 const commandName = command.split(/\//g).pop() as string;
 const cooldown = ch.cache.cooldown
  .get(cmd.channelId)
  ?.get(
   commandName || ch.constants.commands.interactions.find((c) => c.name === commandName)
    ? 'interactions'
    : '',
  );
 if (cooldown) {
  const language = await ch.getLanguage(cmd.guildId);
  ch.errorCmd(
   cmd,
   language.events.interactionCreate.cooldown(ch.moment(cooldown, language)),
   language,
  );
  return;
 }

 (await import(command)).default(cmd);
};
