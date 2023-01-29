import * as Discord from 'discord.js';
import bitUniques from './bitUniques.js';
import reply from './replyMsg.js';
import * as util from './util.js';
import type CT from '../../Typings/CustomTypings';

export default async (
  msg: Discord.Message,
  bits: bigint | number,
  language: CT.Language,
  me?: boolean,
) => {
  if (!msg) return;
  if (!msg.guild) return;
  if (typeof bits === 'number') bits = BigInt(bits);

  const clientMember = msg.guild?.members.me;
  const client = (await import('../Client.js')).default;
  const neededPerms = new Discord.PermissionsBitField(
    bitUniques(
      bits,
      me
        ? BigInt(clientMember?.permissions.bitfield || 0)
        : BigInt(msg.member?.permissions.bitfield || 0),
    )[0],
  );

  const embed: Discord.APIEmbed = {
    author: {
      name: language.error,
      icon_url: client.customConstants.standard.error,
      url: client.customConstants.standard.invite,
    },
    color: client.customConstants.colors.danger,
    description: me ? language.permissions.error.msg : language.permissions.error.you,
    fields: [
      {
        name: util.makeBold(language.permissions.error.needed),
        value: `\u200b${
          neededPerms.has(8n)
            ? `${util.makeInlineCode(language.permissions.perms.Administrator)}`
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
