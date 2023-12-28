import * as Discord from 'discord.js';
import * as ch from '../BaseClient/ClientHelper.js';

export default async (eventName: string, args: unknown[]) => {
 switch (true) {
  case typeof args[0] === 'object' && args[0] && args[0] instanceof Discord.Guild: {
   ch.firstGuildInteraction(args[0] as Discord.Guild);
   break;
  }
  case typeof args[1] === 'object' && args[1] && args[1] instanceof Discord.Guild: {
   ch.firstGuildInteraction(args[1] as Discord.Guild);
   break;
  }
  case typeof args[0] === 'object' &&
   args[0] &&
   'guild' in (args[0] as Record<'guild', Discord.Guild>): {
   ch.firstGuildInteraction((args[0] as Record<'guild', Discord.Guild>).guild as Discord.Guild);
   break;
  }
  case typeof args[1] === 'object' &&
   args[1] &&
   'guild' in (args[1] as Record<'guild', Discord.Guild>): {
   ch.firstGuildInteraction((args[1] as Record<'guild', Discord.Guild>).guild as Discord.Guild);
   break;
  }
  default: {
   break;
  }
 }

 const event = (await ch.getEvents()).find((e) => e.endsWith(`${eventName}.js`));
 if (!event) return;

 (await import(event)).default(...args);
};
