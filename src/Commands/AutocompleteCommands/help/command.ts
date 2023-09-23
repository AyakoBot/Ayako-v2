import Discord from 'discord.js';
import StringSimilarity from 'string-similarity';
import * as CT from '../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const value = cmd.options.getString('command', true);
 const commands = value.length
  ? StringSimilarity.findBestMatch(
     value,
     cmd.client.application.commands.cache.map((c) => c.name),
    )
     .ratings.sort((a, b) => b.rating - a.rating)
     .map((r) => cmd.client.application.commands.cache.find((c) => c.name === r.target))
  : cmd.client.application.commands.cache.map((c) => c);

 const uniqueCommands = new Discord.Collection<string, Discord.ApplicationCommand>();
 commands
  .filter((c): c is Discord.ApplicationCommand => !!c)
  .forEach((c) => uniqueCommands.set(c.name, c));

 return uniqueCommands
  .map((c) => ({
   name: c.name ?? '-',
   value: c.id,
  }))
  .splice(0, 25);
};

export default f;
