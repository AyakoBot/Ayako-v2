import * as Discord from 'discord.js';
import { CaptchaGenerator } from 'captcha-canvas';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../Typings/DataBaseTypings';
import type * as CT from '../../../Typings/CustomTypings';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const verification = await ch.query(
  `SELECT * FROM verification WHERE guildid = $1 AND active = true;`,
  [cmd.guildId],
  {
   returnType: 'verification',
   asArray: false,
  },
 );
 if (!verification) return;

 const language = await ch.languageSelector(cmd.guildId);

 if (await isVerified(cmd, verification, language)) return;

 log(cmd, verification, language);
 await verify(cmd, language);
};

const isVerified = async (
 cmd: Discord.ButtonInteraction,
 verification: DBT.verification,
 language: CT.Language,
) => {
 if (!verification.finishedrole) return false;

 const role = cmd.guild?.roles.cache.get(verification.finishedrole);
 if (!role) return false;

 const sendReply = () =>
  ch.replyCmd(cmd, { content: language.verification.alreadyVerified, ephemeral: true });
 const member = await cmd.guild?.members.fetch(cmd.user.id).catch(() => undefined);
 if (!member) {
  sendReply();
  return true;
 }

 if (member.roles.cache.has(verification.finishedrole)) {
  sendReply();

  if (verification.pendingrole && member.roles.cache.has(verification.pendingrole)) {
   ch.roleManager.remove(member, [verification.pendingrole], language.verification.log.finished);
  }
  return true;
 }

 return false;
};

const log = async (
 cmd: Discord.ButtonInteraction,
 verification: DBT.verification,
 language: CT.Language,
) => {
 if (!verification.logchannel) return;

 const channel = await ch.getChannel.guildTextChannel(verification.logchannel);
 if (!channel) return;

 ch.send(channel, {
  embeds: [
   {
    author: {
     name: language.verification.title,
     icon_url: cmd.user.displayAvatarURL({ size: 4096 }),
    },
    description: language.verification.log.start(cmd.user),
    timestamp: new Date(Date.now()).toString(),
    color: ch.constants.colors.loading,
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

 ch.replyCmd(cmd, {
  ephemeral: true,
  embeds: [
   {
    image: {
     url: `attachment://${file.name}`,
    },
    title: language.verification.title,
    url: ch.constants.standard.invite,
    description: language.verification.description(cmd.guild),
    fields: [
     {
      name: language.verification.hint,
      value: language.verification.hintmsg,
     },
    ],
    color: ch.colorSelector(cmd.guild.members.me),
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
