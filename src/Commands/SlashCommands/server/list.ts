import * as Discord from 'discord.js';

export default async (
 cmd:
  | Discord.ChatInputCommandInteraction
  | Discord.ButtonInteraction
  | Discord.ModalMessageModalSubmitInteraction,
 _: string[],
 page = 1,
) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.server;
 const guilds = await cmd.client.cluster?.broadcastEval((cl) =>
  cl.guilds?.cache.map((g) => ({
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
   members: cmd.client.util.splitByThousand(g.members),
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

 let longestName = Math.max(...guildsFlatted.map((g) => g.name.length));
 let longestMemberCount = Math.max(...guildsFlatted.map((g) => g.members.length));
 let longestInvite = Math.max(...guildsFlatted.map((g) => Number(g.invite?.length)));

 if (longestName < language.t.name.length) longestName = language.t.name.length;
 if (longestMemberCount < language.t.Members.length) longestMemberCount = language.t.Members.length;
 if (longestInvite < language.t.Invite.length) longestInvite = language.t.Invite.length;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: cmd.client.util.getColor(
   cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
  ),
  description: `${cmd.client.util.util.makeInlineCode(
   `${cmd.client.util.spaces(language.t.name, longestName)} | ${cmd.client.util.spaces(
    language.t.Members,
    longestMemberCount,
   )} | ${cmd.client.util.spaces(language.t.Invite, longestInvite)} `,
  )}\n${guildsFlatted
   .map((g) =>
    cmd.client.util.util.makeInlineCode(
     `${cmd.client.util.spaces(g.name, longestName)} | ${cmd.client.util.spaces(
      g.members,
      longestMemberCount,
     )} | ${cmd.client.util.spaces(g.invite ?? '-', longestInvite)} `,
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
     emoji: cmd.client.util.emotes.back,
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
     emoji: cmd.client.util.emotes.forth,
     style: Discord.ButtonStyle.Secondary,
     disabled: Math.ceil(flat.length / 60) === page,
     custom_id: `server/page_${page}_forth`,
    },
   ],
  },
 ];

 if (cmd.isChatInputCommand()) cmd.client.util.replyCmd(cmd, { embeds: [embed], components });
 else cmd.update({ embeds: [embed], components } as Discord.InteractionUpdateOptions);
};
