import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 const inviteOrId = args.shift() as string;
 const isInviteGuild = (args.shift() as string) === 'true';
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const invite = isInviteGuild
  ? await client.fetchInvite(inviteOrId).catch(() => undefined)
  : undefined;
 const serverId = isInviteGuild ? invite?.guild?.id : inviteOrId;

 if (!serverId) {
  cmd.client.util.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }

 if (invite) cmd.client.util.cache.inviteGuilds.set(serverId, invite.guild as Discord.InviteGuild);

 const embed = (await getEmbed(serverId))?.flat()[0];
 const contents: string[][] = [[]];
 let lastIndex = 0;

 embed?.description
  ?.split(/\n+/g)
  .sort((a, b) => Number(b.startsWith('☑️')) - Number(a.startsWith('☑️')))
  .forEach((v) => {
   if (contents[lastIndex].join('\n').length + v.length > 4096) lastIndex += 1;
   if (!contents[lastIndex]) contents[lastIndex] = [];
   contents[lastIndex].push(v);
  });

 const embeds = contents.map((c) => ({
  ...embed,
  description: c.join('\n'),
 }));

 if (!embeds) {
  cmd.client.util.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }
 cmd.client.util.replyCmd(cmd, {
  embeds,
 });
};

const getEmbed = async (serverId: string): Promise<Discord.APIEmbed[] | undefined> =>
 client.cluster?.broadcastEval(
  async (c, { id }) => {
   const g = c.guilds.cache.get(id) ?? c.util.cache.inviteGuilds.get(id);
   if (!g) return undefined;

   const language = await c.util.getLanguage(g.id);
   const isInviteGuild = !('members' in g);

   return [
    {
     color: c.util.getColor(isInviteGuild ? undefined : await c.util.getBotMemberFromGuild(g)),
     description: Object.entries(language.features)
      .map(([k, v]) => `${g.features.includes(k as Discord.GuildFeature) ? '☑️' : '❌'} ${v}`)
      .join('\n'),
    },
   ];
  },
  {
   context: { id: serverId },
  },
 ) as Promise<Discord.APIEmbed[] | undefined>;
