import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 page = 1,
) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const servers = await getServers(language);
 if (!servers) {
  ch.errorCmd(cmd, language.slashCommands.info.servers.noneFound, language);
  return;
 }

 const content = getContent(servers);
 const payload = await getPayload(content, language, cmd.guild, page);

 if (cmd.isButton()) cmd.update(payload as Discord.InteractionUpdateOptions).catch(() => undefined);
 else ch.replyCmd(cmd, payload);
};

const getServers = async (language: CT.Language) =>
 (
  await client.shard?.broadcastEval(
   async (c, { lang }) => {
    const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);

    return c.guilds.cache.map((g) => ({
     content: `${chEval.util.makeInlineCode(g.name)}\n> ${chEval.splitByThousand(g.memberCount)} ${
      lang.Members
     } ${g.vanityURLCode ? ` - [${lang.Join}](https://discord.gg/${g.vanityURLCode})` : ''}`,
     count: g.memberCount,
    }));
   },
   { context: { lang: language } },
  )
 )
  ?.flat()
  .sort((a, b) => b.count - a.count);

const getContent = (servers: { content: string; count: number }[]) =>
 ch
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
   color: ch.colorSelector(await ch.getBotMemberFromGuild(guild)),
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
     emoji: ch.objectEmotes.back,
     disabled: page === 1,
    },
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Primary,
     label: language.slashCommands.settings.next,
     custom_id: `info/servers_${page + 1}`,
     emoji: ch.objectEmotes.forth,
     disabled: page === content.length,
    },
   ],
  },
 ],
});
