import Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'welcome' | undefined;
 if (!type) return;

 cmd.deferUpdate();

 switch (type) {
  case 'welcome': {
   cmd.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.welcome.file.default(
    cmd.member,
   );
   break;
  }
  default: {
   throw new Error(`Unknown Type ${type}`);
  }
 }
};
