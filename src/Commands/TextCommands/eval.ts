import type * as Discord from 'discord.js';

// @ts-ignore
import auth from '../../auth.json' assert { type: 'json' };
// @ts-ignore
import fetch from 'node-fetch';
// @ts-ignore
import * as ch from '../../BaseClient/ClientHelper.js';

export const cooldown = 0;
export const name = 'eval';
export const takesFirstArg = true;
export const aliases = [];
export const thisGuildOnly = [];
export const perm = 0;
export const dmOnly = false;
export const dmAllowed = true;
export const type = 'owner';

export default async (msg: Discord.Message) => {
  const content = msg.content.split('eval ')[1];

  try {
    // eslint-disable-next-line no-console
    console.log(
      msg.content.includes('await') || msg.content.includes('return')
        ? // eslint-disable-next-line no-eval
          await eval(`(async () => {${content}})()`)
        : // eslint-disable-next-line no-eval
          eval(content),
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};
