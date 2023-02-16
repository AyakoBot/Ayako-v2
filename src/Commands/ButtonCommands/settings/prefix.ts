import type * as Discord from 'discord.js';

export default (cmd: Discord.ButtonInteraction, args: string[]) => {
  console.log(cmd, args);
};
