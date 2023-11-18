import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.resetLevels;
 const type = args.shift() as 'all' | 'user' | 'role';
 const id = args.shift() as typeof type extends 'all' ? undefined : string;

 let content = '';

 switch (type) {
  case 'all': {
   ch.DataBase.level.deleteMany({ where: { guildid: cmd.guildId } }).then();
   content = lan.all;
   break;
  }
  case 'role': {
   const role = cmd.guild.roles.cache.get(id);
   if (!role) {
    ch.errorCmd(cmd, language.t.errors.roleNotFound, language);
    return;
   }

   ch.DataBase.level
    .deleteMany({ where: { guildid: cmd.guildId, userid: { in: role.members.map((m) => m.id) } } })
    .then();

   content = lan.role(role, role.members.size);
   break;
  }
  case 'user': {
   const user = await ch.getUser(id);
   if (!user) {
    ch.errorCmd(cmd, language.t.errors.userNotFound, language);
    return;
   }

   ch.DataBase.level
    .delete({
     where: { userid_guildid_type: { userid: user.id, guildid: cmd.guildId, type: 'guild' } },
    })
    .then();

   content = lan.user(user);
   break;
  }
  default: {
   break;
  }
 }

 cmd.update({ content, components: [] });
};
