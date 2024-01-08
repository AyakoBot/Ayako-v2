import * as Discord from 'discord.js';
import rp from '../../SlashCommands/rp/manager.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 await cmd.deferUpdate();
 cmd.editReply({
  components: [],
  embeds: [
   cmd.client.util.loadingEmbed({ language, lan: { author: language.slashCommands.rp.author } }),
  ],
 });

 const settings = !(await cmd.client.util.DataBase.guildsettings
  .findUnique({
   where: { guildid: cmd.guildId },
   select: { enabledrp: true },
  })
  .then((r) => r?.enabledrp));

 cmd.client.util.DataBase.guildsettings
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
 await cmd.client.util.request.commands.bulkOverwriteGuildCommands(
  cmd.guild,
  (
   [...(cmd.client.util.cache.commands.cache.get(cmd.guild.id)?.values() ?? [])] ??
   cmd.guild.commands.cache.map((c) => c)
  )
   .filter(
    (c) =>
     !cmd.client.util.constants.commands.interactions.find((i) => i.name === c.name) && !c.guildId,
   )
   .map((c) => c.toJSON() as Discord.APIApplicationCommand),
 );
};

export const create = async (guild: Discord.Guild) => {
 const commands = await guild.client.util.request.commands.getGuildCommands(guild);

 if ('message' in commands) {
  guild.client.util.error(guild, new Error(commands.message));
  return;
 }

 const registerCommands = guild.client.util.constants.commands.interactions
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

 await guild.client.util.request.commands.bulkOverwriteGuildCommands(guild, [
  ...registerCommands.map((c) => c.toJSON()),
  ...[
   ...(guild.client.util.cache.commands.cache.get(guild.id)?.values() ??
    guild.commands.cache.map((c) => c)),
  ]
   .filter(
    (c) =>
     !guild.client.util.constants.commands.interactions.find((i) => i.name === c.name) &&
     !c.guildId &&
     !registerCommands.find((r) => r.name === c.name),
   )
   .map((c) => c.toJSON() as Discord.APIApplicationCommand),
 ]);

 await guild.client.util.DataBase.guildsettings.upsert({
  where: { guildid: guild.id },
  update: { rpenableruns: { increment: 1 } },
  create: {
   guildid: guild.id,
   rpenableruns: 1,
   enabledrp: true,
  },
 });
};
