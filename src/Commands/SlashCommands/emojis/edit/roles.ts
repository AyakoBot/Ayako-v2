import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.RoleSelectMenuInteraction,
 e?: Discord.GuildEmoji,
) => {
 if (!cmd.inCachedGuild()) return;

 const rawEmoji =
  cmd instanceof Discord.RoleSelectMenuInteraction
   ? undefined
   : Discord.parseEmoji(cmd.options.getString('emoji', true));
 const emoji = e ?? (rawEmoji?.id ? cmd.guild.emojis.cache.get(rawEmoji.id) : undefined);

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.emojis;

 if (!emoji) {
  ch.errorCmd(cmd, language.errors.emoteNotFound, await ch.getLanguage(cmd.guildId));
  return;
 }

 const embeds = [
  {
   color: ch.colorSelector(await ch.getBotMemberFromGuild(cmd.guild)),
   description: emoji.roles.cache.size
    ? emoji.roles.cache
       .sort((a, b) => b.position - a.position)
       .map((r) => r)
       .join(', ') ?? language.None
    : language.None,
   footer: {
    text: lan.explain,
   },
  },
 ];
 const components: Discord.APIActionRowComponent<Discord.APIRoleSelectComponent>[] = [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.RoleSelect,
     custom_id: `emojis/roles_${emoji.id}`,
     placeholder: lan.placeholder,
     max_values: 25,
     min_values: 0,
    },
   ],
  },
 ];

 if (cmd instanceof Discord.RoleSelectMenuInteraction) {
  await cmd.update({
   embeds: [
    {
     color: ch.constants.colors.loading,
     author: {
      name: language.loading,
      icon_url: ch.emotes.loading.link,
     },
    },
   ],
   components: [],
  });

  cmd.editReply({ embeds, components });
 } else ch.replyCmd(cmd, { embeds, components });
};
