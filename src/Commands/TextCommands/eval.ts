import * as Discord from 'discord.js';

// @ts-ignore
import auth from '../../auth.json' assert { type: 'json' };
// @ts-ignore
import fetch from 'node-fetch';
// @ts-ignore
import * as ch from '../../BaseClient/ClientHelper.js';

export const cooldown = 0;
export const name = 'eval';
export const takesFirstArg = false;
export const aliases = [];
export const thisGuildOnly = [];
export const perm = 0;
export const dmOnly = false;
export const dmAllowed = true;
export const type = 'owner';

export default async (msg: Discord.Message) => {
  msg.reply({
    content: 'uwu',
    components: [
      {
        type: Discord.ComponentType.ActionRow,
        components: [
          {
            type: Discord.ComponentType.Button,
            style: Discord.ButtonStyle.Link,
            label: 'Take me to the winner',
            url: `discord://-/users/${msg.author.id}`,
          },
        ],
      },
    ],
  });
};
