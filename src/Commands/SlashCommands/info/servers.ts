import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _args: string[],
 page = 1,
) => {
 const ephemeral =
  cmd instanceof Discord.ChatInputCommandInteraction
   ? cmd.options.getBoolean('hide', false) ?? true
   : true;
 const language = await client.util.getLanguage(cmd.guildId);
 const servers = await getServers(language);
 if (!servers) {
  client.util.errorCmd(cmd, language.slashCommands.info.servers.noneFound, language);
  return;
 }

 const content = getContent(servers);
 const payload = await getPayload(content, language, cmd.guild, page);

 if (cmd.isButton()) cmd.update(payload as Discord.InteractionUpdateOptions).catch(() => undefined);
 else client.util.replyCmd(cmd, { ...payload, ephemeral });
};

const getServers = async (language: CT.Language) =>
 (
  await client.cluster?.broadcastEval(
   async (c, { lang }) =>
    c.guilds?.cache.map((g) => ({
     content: `${c.util.util.makeInlineCode(g.name)}\n> ${c.util.splitByThousand(g.memberCount)} ${
      lang.members
     } ${g.vanityURLCode ? ` - [${lang.join}](https://discord.gg/${g.vanityURLCode})` : ''}`,
     count: g.memberCount,
    })),
   { context: { lang: { join: language.t.Join, members: language.t.Members } } },
  )
 )
  ?.flat()
  .sort((a, b) => b.count - a.count);

const getContent = (servers: { content: string; count: number }[]) =>
 client.util
  .getStringChunks(servers?.length ? servers.map((s) => s.content) : [], 4096)
  .map((c) => c.join('\n'))
  .filter((c) => c.length);

const getPayload = async (
 content: string[],
 language: CT.Language,
 guild?: Discord.Guild | undefined | null,
 page = 1,
): Promise<CT.UsualMessagePayload> => ({
 embeds: [
  {
   color: client.util.getColor(guild ? await client.util.getBotMemberFromGuild(guild) : undefined),
   description: content[page - 1],
  },
 ] as Discord.APIEmbed[],
 components: [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Primary,
     label: language.slashCommands.settings.previous,
     custom_id: `info/servers_${page === 1 ? 1 : page - 1}`,
     emoji: client.util.emotes.back,
     disabled: page === 1,
    },
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Primary,
     label: language.slashCommands.settings.next,
     custom_id: `info/servers_${page + 1}`,
     emoji: client.util.emotes.forth,
     disabled: page === content.length,
    },
   ],
  },
 ],
});
