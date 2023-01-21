import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';

export default async (
  msg: CT.Message | CT.GuildMessage | Discord.Message,
  answer: Discord.Component,
  options: { [key: string]: string },
  embed: Discord.APIEmbed,
  page: number,
) =>
  (await import(`${process.cwd()}/dist/Commands/TextCommands/embedbuilder`)).builder(
    msg,
    answer,
    embed,
    page,
    options,
  );
