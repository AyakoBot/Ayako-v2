import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.resetLevels;
 const type = args.shift() as 'all' | 'user' | 'role';
 const id = args.shift() as typeof type extends 'all' ? undefined : string;

 let content = '';

 switch (type) {
  case 'all': {
   cmd.client.util.DataBase.level.deleteMany({ where: { guildid: cmd.guildId } }).then();
   content = lan.all;
   break;
  }
  case 'role': {
   const role = cmd.guild.roles.cache.get(id);
   if (!role) {
    cmd.client.util.errorCmd(cmd, language.errors.roleNotFound, language);
    return;
   }

   cmd.client.util.DataBase.level
    .deleteMany({ where: { guildid: cmd.guildId, userid: { in: role.members.map((m) => m.id) } } })
    .then();

   content = lan.role(role, role.members.size);
   break;
  }
  case 'user': {
   const user = await cmd.client.util.getUser(id);
   if (!user) {
    cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
    return;
   }

   cmd.client.util.DataBase.level
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
