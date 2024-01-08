import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 cmd: Discord.ButtonInteraction | Discord.ChatInputCommandInteraction,
 args: string[],
) => {
 if (!cmd.inCachedGuild()) return;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.role;

 const role = cmd.guild.roles.cache.get(args.shift() as string);
 if (!role) return;

 await cmd.client.util.replyCmd(cmd, {
  embeds:
   role.members.size > 163
    ? []
    : [
       {
        color:
         role.color ||
         cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
        description: getDescription(role, language),
        author: {
         name: lan.author,
        },
       },
      ],
  files: [
   {
    name: `${language.t.Members}.txt`,
    attachment: Buffer.from(getDescription(role, language, true)),
   },
  ],
 });
};

const getDescription = (role: Discord.Role, language: CT.Language, overWriteMax?: boolean) => {
 switch (true) {
  case overWriteMax: {
   return role.members.map((m) => `${language.languageFunction.getUser(m.user)}`).join('');
  }
  case role.members.size === 0: {
   return language.slashCommands.info.role.noMembers;
  }
  case role.members.size > 50: {
   return role.members.map((m) => `<@${m.id}>`).join(', ');
  }
  default: {
   return role.members.map((m) => `${language.languageFunction.getUser(m.user)}`).join('');
  }
 }
};
