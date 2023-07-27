import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (
 cmd: Discord.ButtonInteraction | Discord.ChatInputCommandInteraction,
 args: string[],
) => {
 if (!cmd.inCachedGuild()) return;
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.info.role;

 const role = cmd.guild.roles.cache.get(args.shift() as string);
 if (!role) return;

 await ch.replyCmd(cmd, {
  embeds:
   role.members.size > 163
    ? []
    : [
       {
        color: role.color || ch.colorSelector(cmd.guild?.members.me),
        description: getDescription(role, language),
        author: {
         name: lan.author,
        },
       },
      ],
  files: [
   {
    name: `${language.Members}.txt`,
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
