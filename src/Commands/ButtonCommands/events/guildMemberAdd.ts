import Discord from 'discord.js';
import welcome from '../../../Events/guildEvents/guildMemberAdd/welcome.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'welcome' | undefined;
 if (!type) return;

 cmd.deferUpdate();

 switch (type) {
  case 'welcome': {
   welcome(cmd.member);
   break;
  }
  default: {
   throw new Error(`Unknown Type ${type}`);
  }
 }
};
