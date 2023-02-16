import type * as CT from '../../Typings/CustomTypings';

export const cooldown = 0;
export const name = 'eval';
export const takesFirstArg = true;
export const aliases = [];
export const thisGuildOnly = [];
export const perm = 0;
export const dmOnly = false;
export const dmAllowed = true;
export const type = 'owner';

export default async (msg: CT.GuildMessage) => {
  try {
    // eslint-disable-next-line no-console
    console.log(
      msg.content.includes('await') || msg.content.includes('return')
        ? // eslint-disable-next-line no-eval
          await eval(`(async () => {${msg}})()`)
        : // eslint-disable-next-line no-eval
          eval(msg.content),
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};
