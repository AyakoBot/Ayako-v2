import type DDeno from 'discordeno';

export default async (
  msg: DDeno.Message,
  answer: DDeno.Component,
  options: { [key: string]: string },
  embed: DDeno.Embed,
  page: number,
) =>
  (await import(`${process.cwd()}/dist/Commands/TextCommands/embedbuilder`)).builder(
    msg,
    answer,
    embed,
    page,
    options,
  );
