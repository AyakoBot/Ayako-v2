import Prisma from '@prisma/client';
import { CaptchaGenerator } from 'captcha-canvas';
import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;

 const verification = await cmd.client.util.DataBase.verification.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!verification) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (await isVerified(cmd, verification, language)) return;

 log(cmd, verification, language);
 await verify(cmd, language);
};

const isVerified = async (
 cmd: Discord.ButtonInteraction<'cached'>,
 verification: Prisma.verification,
 language: CT.Language,
) => {
 if (!verification.finishedrole) return false;

 const role = cmd.guild?.roles.cache.get(verification.finishedrole);
 if (!role) return false;

 const sendReply = () =>
  cmd.client.util.replyCmd(cmd, {
   content: language.verification.alreadyVerified,
   ephemeral: true,
  });
 if (!cmd.member) {
  sendReply();
  return true;
 }

 if (
  ('cache' in cmd.member.roles && cmd.member.roles.cache.has(verification.finishedrole)) ||
  (Array.isArray(cmd.member.roles) && cmd.member.roles.includes(verification.finishedrole))
 ) {
  sendReply();

  if (
   verification.pendingrole &&
   (('cache' in cmd.member.roles && cmd.member.roles.cache.has(verification.pendingrole)) ||
    (Array.isArray(cmd.member.roles) && cmd.member.roles.includes(verification.pendingrole)))
  ) {
   cmd.client.util.roleManager.remove(
    cmd.member,
    [verification.pendingrole],
    language.verification.log.finished,
   );
  }
  return true;
 }

 return false;
};

const log = async (
 cmd: Discord.ButtonInteraction,
 verification: Prisma.verification,
 language: CT.Language,
) => {
 if (!verification.logchannel) return;

 const channel = await cmd.client.util.getChannel.guildTextChannel(verification.logchannel);
 if (!channel) return;

 cmd.client.util.send(channel, {
  embeds: [
   {
    author: {
     name: language.verification.title,
     icon_url: cmd.user.displayAvatarURL({ size: 4096 }),
    },
    description: language.verification.log.start(cmd.user),
    timestamp: new Date().toISOString(),
    color: CT.Colors.Loading,
   },
  ],
 });
};

const verify = async (cmd: Discord.ButtonInteraction, language: CT.Language) => {
 if (!cmd.guild) return;

 const captcha = new CaptchaGenerator({ height: 200, width: 600 });
 captcha.setCaptcha({ characters: 4, size: 50 });
 captcha.setTrace({ size: 2, opacity: 3 });
 const buffer = captcha.generateSync();
 const now = Date.now();
 const file = {
  attachment: buffer,
  name: `${now}.png`,
 };

 cmd.client.util.replyCmd(cmd, {
  ephemeral: true,
  embeds: [
   {
    image: {
     url: `attachment://${file.name}`,
    },
    title: language.verification.title,
    url: cmd.client.util.constants.standard.invite,
    description: language.verification.description(cmd.guild),
    fields: [
     {
      name: language.verification.hint,
      value: language.verification.hintmsg,
     },
    ],
    color: cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
   },
  ],
  files: [file],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Success,
      custom_id: `verification/enterCode_${captcha.text}`,
      label: language.verification.enterCode,
     },
    ],
   },
  ],
 });
};
