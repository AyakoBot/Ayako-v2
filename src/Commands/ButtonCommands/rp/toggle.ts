import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import rp from '../../SlashCommands/rp/manager.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);

 await cmd.deferUpdate();
 cmd.editReply({
  components: [],
  embeds: [ch.loadingEmbed({ language, lan: { author: language.slashCommands.rp.author } })],
 });

 const settings = !(await ch.DataBase.guildsettings
  .findUnique({
   where: { guildid: cmd.guildId },
   select: { enabledrp: true },
  })
  .then((r) => r?.enabledrp));

 ch.DataBase.guildsettings
  .upsert({
   where: { guildid: cmd.guildId },
   create: { guildid: cmd.guildId, enabledrp: settings },
   update: { enabledrp: settings },
  })
  .then();

 if (!settings) await deleteAll(cmd);
 else await create(cmd.guild);

 rp(cmd, [], true);
};

const deleteAll = async (cmd: Discord.ButtonInteraction<'cached'>) => {
 await ch.request.commands.bulkOverwriteGuildCommands(
  cmd.guild,
  (
   [...(ch.cache.commands.cache.get(cmd.guild.id)?.values() ?? [])] ??
   cmd.guild.commands.cache.map((c) => c)
  )
   .filter((c) => !!c.guildId)
   .map((c) => c.toJSON() as Discord.APIApplicationCommand)
   .filter((c) => !ch.constants.commands.interactions.find((i) => i.name === c.name)),
 );
};

export const create = async (guild: Discord.Guild) => {
 const commands = await ch.request.commands.getGuildCommands(guild);

 if ('message' in commands) {
  ch.error(guild, new Error(commands.message));
  return;
 }

 const registerCommands = ch.constants.commands.interactions
  .filter((c) => !commands.find((existing) => existing.name === c.name))
  .map((c) => {
   const command = new Discord.SlashCommandBuilder().setName(c.name).setDescription(c.desc);

   if (c.users) {
    command.addUserOption(
     new Discord.SlashCommandUserOption()
      .setDescription('The User to interact with')
      .setRequired(c.reqUser)
      .setName('user'),
    );
   }

   command.addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('text')
     .setDescription('The text to Display')
     .setRequired(false),
   );

   if ('specialOptions' in c && c.specialOptions) {
    c.specialOptions.forEach((o) =>
     command.addStringOption(
      new Discord.SlashCommandStringOption()
       .setName(o.name)
       .setDescription(o.desc)
       .setRequired(false),
     ),
    );
   }

   if (c.users) {
    new Array(5).fill(null).forEach((_, i) => {
     command.addUserOption(
      new Discord.SlashCommandUserOption()
       .setDescription(`Another User to interact with`)
       .setRequired(false)
       .setName(`user-${i}`),
     );
    });
   }

   return command;
  });

 await ch.request.commands.bulkOverwriteGuildCommands(guild, [
  ...registerCommands.map((c) => c.toJSON()),
  ...(
   [...(ch.cache.commands.cache.get(guild.id)?.values() ?? [])] ??
   guild.commands.cache.map((c) => c)
  )
   .map((c) => c.toJSON() as Discord.APIApplicationCommand)
   .filter((c) => !ch.constants.commands.interactions.find((i) => i.name === c.name)),
 ]);

 await ch.DataBase.guildsettings.update({
  where: { guildid: guild.id },
  data: { rpenableruns: { increment: 1 } },
 });
};
