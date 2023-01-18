import type * as Discord from 'discord.js';

export default async (
  msg: DDeno.Message,
  answer: DDeno.Component,
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
