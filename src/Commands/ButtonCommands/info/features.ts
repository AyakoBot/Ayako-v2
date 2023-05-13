import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 const inviteOrID = args.shift() as string;
 const isInviteGuild = (args.shift() as string) === 'true';
 const language = await ch.languageSelector(cmd.guildId);
 const invite = isInviteGuild
  ? await client.fetchInvite(inviteOrID).catch(() => undefined)
  : undefined;
 const serverID = isInviteGuild ? invite?.guild?.id : inviteOrID;

 if (!serverID) {
  ch.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }

 if (invite) ch.cache.inviteGuilds.set(serverID, invite.guild as Discord.InviteGuild);

 const embed = (await getEmbed(serverID))?.flat()[0];
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
  ch.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }
 ch.replyCmd(cmd, {
  embeds,
 });
};

const getEmbed = async (serverID: string): Promise<Discord.APIEmbed[] | undefined> =>
 client.shard?.broadcastEval(
  async (c, { id }) => {
   const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);
   const g = c.guilds.cache.get(id) ?? chEval.cache.inviteGuilds.get(id);
   if (!g) return undefined;

   const language = await chEval.languageSelector(g.id);
   const isInviteGuild = !('members' in g);

   return [
    {
     color: chEval.colorSelector(isInviteGuild ? undefined : g.members.me),
     description: Object.entries(language.features)
      .map(([k, v]) => `${g.features.includes(k as Discord.GuildFeature) ? '☑️' : '❌'} ${v}`)
      .join('\n'),
    },
   ];
  },
  {
   context: { id: serverID },
  },
 ) as Promise<Discord.APIEmbed[] | undefined>;
