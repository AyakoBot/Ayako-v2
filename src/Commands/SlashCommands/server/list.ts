import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (
 cmd:
  | Discord.ChatInputCommandInteraction
  | Discord.ButtonInteraction
  | Discord.ModalMessageModalSubmitInteraction,
 _: string[],
 page = 1,
) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.server;
 const guilds = await cmd.client.shard?.broadcastEval((cl) =>
  cl.guilds.cache.map((g) => ({
   name: g.name,
   id: g.id,
   members: g.memberCount,
   invite: g.vanityURLCode || g.invites.cache.first()?.code,
  })),
 );

 const flat = guilds?.flat();
 if (!flat) return;
 if (page > Math.ceil(flat.length / 60)) page = Math.ceil(flat.length / 60);
 if (page < 1) page = 1;

 const guildsFlatted = flat
  .sort((a, b) => b.members - a.members)
  .slice(60 * page - 60, 60 * page)
  .map((g) => ({
   ...g,
   members: ch.splitByThousand(g.members),
   name: `${g.name
    .replace(/[^\w\s'|\-!"§$%&/()=?`´{[\]}^°<>,;.:-_#+*~]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 39)}${
    g.name.replace(/[^\w\s'|\-!"§$%&/()=?`´{[\]}^°<>,;.:-_#+*~]/g, '').replace(/\s+/g, ' ').length >
    39
     ? '…'
     : ' '
   }`,
  }));

 let longestName = guildsFlatted.reduce((a, b) => (a.name.length > b.name.length ? a : b)).name
  .length;
 let longestMemberCount = guildsFlatted.reduce((a, b) => (a.members > b.members ? a : b)).members
  .length;
 let longestInvite =
  guildsFlatted.reduce((a, b) => ((a.invite?.length || 0) > (b.invite?.length || 0) ? a : b)).invite
   ?.length || 0;

 if (longestName < language.name.length) longestName = language.name.length;
 if (longestMemberCount < language.Members.length) longestMemberCount = language.Members.length;
 if (longestInvite < language.Invite.length) longestInvite = language.Invite.length;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
  description: `${ch.util.makeInlineCode(
   `${ch.spaces(language.name, longestName)} | ${ch.spaces(
    language.Members,
    longestMemberCount,
   )} | ${ch.spaces(language.Invite, longestInvite)} `,
  )}\n${guildsFlatted
   .map((g) =>
    ch.util.makeInlineCode(
     `${ch.spaces(g.name, longestName)} | ${ch.spaces(g.members, longestMemberCount)} | ${ch.spaces(
      g.invite ?? '-',
      longestInvite,
     )} `,
    ),
   )
   .join('\n')}`,
 };

 const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     emoji: ch.emotes.back,
     style: Discord.ButtonStyle.Secondary,
     disabled: page === 1,
     custom_id: `server/page_${page}_back`,
    },
    {
     type: Discord.ComponentType.Button,
     label: `${page}/${Math.ceil(flat.length / 60)}`,
     style: Discord.ButtonStyle.Secondary,
     disabled: Number(flat.length) <= 60,
     custom_id: `server/select_${page}_${Math.ceil(flat.length / 60)}`,
    },
    {
     type: Discord.ComponentType.Button,
     emoji: ch.emotes.forth,
     style: Discord.ButtonStyle.Secondary,
     disabled: Math.ceil(flat.length / 60) === page,
     custom_id: `server/page_${page}_forth`,
    },
   ],
  },
 ];

 if (cmd.isChatInputCommand()) ch.replyCmd(cmd, { embeds: [embed], components });
 else cmd.update({ embeds: [embed], components } as Discord.InteractionUpdateOptions);
};
