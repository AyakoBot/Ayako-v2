import type DDeno from 'discordeno';
import Discord from 'discord.js';
import bitUniques from './bitUniques.js';
import reply from './replyMsg.js';
import * as util from './util.js';
import client from '../DDenoClient.js';

export default async (
  msg: DDeno.Message,
  bits: bigint | number,
  language: typeof import('../../Languages/en.json'),
  me?: boolean,
) => {
  if (!msg) return;
  if (!msg.guildId) return;
  if (typeof bits === 'number') bits = BigInt(bits);

  const clientMember = await client.cache.members.get(client.id, msg.guildId);
  if (!clientMember) return;

  const neededPerms = new Discord.PermissionsBitField(
    bitUniques(
      bits,
      me ? BigInt(clientMember.permissions || 0) : BigInt(msg.member?.permissions || 0),
    )[0],
  );

  const embed: DDeno.Embed = {
    author: {
      name: language.error,
      iconUrl: client.customConstants.standard.error,
      url: client.customConstants.standard.invite,
    },
    color: client.customConstants.colors.warning,
    description: me ? language.permissions.error.msg : language.permissions.error.you,
    fields: [
      {
        name: util.makeBold(language.permissions.error.needed),
        value: `\u200b${
          neededPerms.has(8n)
            ? `${util.makeInlineCode(language.permissions.perms.administrator)}`
            : Object.entries(neededPerms).map(
                ([name]) =>
                  `${util.makeInlineCode(
                    language.permissions.perms[name as keyof typeof language.permissions.perms],
                  )}`,
              )
        }`,
        inline: false,
      },
    ],
  };

  reply(msg, { embeds: [embed] });
};
