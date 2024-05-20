import { AnswerType } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../BaseClient/Bot/Client.js';
import * as CT from '../../Typings/Typings.js';

export default async ({ appeal }: CT.AppealMessage) => {
 const settings = await client.util.DataBase.appealsettings.findUnique({
  where: { guildid: appeal.guildId, active: true },
 });
 if (!settings) return;
 if (!settings.channelid) return;
 if (settings.bluserid?.includes(appeal.userId)) return;

 const punishment = await getPunishment(appeal);
 if (!punishment) return;

 const guild = client.guilds.cache.get(appeal.guildId);
 if (!guild) return;

 await client.util.firstGuildInteraction(guild);

 const channel = await client.util.getChannel.guildTextChannel(settings.channelid);
 if (!channel) return;

 const user = await client.util.getUser(appeal.userId).catch(() => undefined);
 if (!user) return;

 const language = await client.util.getLanguage(guild.id);
 const lan = language.events.appeal;

 const appealAnswers = await client.util.DataBase.appealanswers.findMany({
  where: { punishmentid: appeal.punishmentId },
 });
 const questions = await client.util.DataBase.appealquestions.findMany({
  where: { guildid: appeal.guildId },
 });

 const embed: Discord.APIEmbed = {
  title: lan.title,
  description: lan.description(
   user,
   String(punishment.uniquetimestamp),
   (await client.util.getCustomCommand(guild, 'check'))?.id ?? '0',
  ),
  color: client.util.getColor(await client.util.getBotMemberFromGuild(guild)),
  fields: appealAnswers
   .map((a) => {
    const question = questions.find((q) => q.uniquetimestamp.equals(a.questionid));
    if (!question) return undefined;

    const getAnswer = () => {
     switch (a.type) {
      case AnswerType.boolean:
       return a.boolean
        ? client.util.constants.standard.getEmote(client.util.emotes.tickWithBackground)
        : client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground);
      case AnswerType.multiple_choice:
       return a.multiplechoice.map((o) => Discord.inlineCode(o.replace(/`/g, '\\`'))).join(', ');
      case AnswerType.number:
       return String(a.number);
      case AnswerType.paragraph:
      case AnswerType.short:
      case AnswerType.single_choice:
       return a.string;
      default:
       return undefined;
     }
    };

    const getInline = () => {
     switch (a.type) {
      case AnswerType.short:
      case AnswerType.boolean:
      case AnswerType.number:
      case AnswerType.single_choice:
       return false;
      case AnswerType.paragraph:
      case AnswerType.multiple_choice:
      default:
       return true;
     }
    };

    return {
     name: question?.question,
     value: getAnswer(),
     inline: getInline(),
    };
   })
   .filter((f): f is { name: string; value: string; inline: boolean } => !!f?.value),
  author: {
   name: lan.author,
  },
 };

 client.util.send(channel, {
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Danger,
      label: lan.reject,
      custom_id: `appeals/reject_${appeal.punishmentId}`,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Success,
      label: lan.accept,
      custom_id: `appeals/accept_${appeal.punishmentId}`,
     },
    ],
   },
  ],
 });
};

export const getPunishment = async ({ punishmentId }: CT.Appeal) => {
 const where = {
  where: { uniquetimestamp: Number(punishmentId) },
 };

 const results = await client.util.DataBase.$transaction([
  client.util.DataBase.punish_bans.findUnique(where),
  client.util.DataBase.punish_channelbans.findUnique(where),
  client.util.DataBase.punish_kicks.findUnique(where),
  client.util.DataBase.punish_mutes.findUnique(where),
  client.util.DataBase.punish_warns.findUnique(where),
  client.util.DataBase.punish_tempchannelbans.findUnique(where),
  client.util.DataBase.punish_tempbans.findUnique(where),
  client.util.DataBase.punish_tempmutes.findUnique(where),
 ]);

 return results
  .map((r, i) => {
   if (!r) return undefined;

   switch (i) {
    case 0:
     return { ...r, type: CT.PunishmentType.Ban };
    case 1:
     return { ...r, type: CT.PunishmentType.Channelban };
    case 2:
     return { ...r, type: CT.PunishmentType.Kick };
    case 3:
     return { ...r, type: CT.PunishmentType.Mute };
    case 4:
     return { ...r, type: CT.PunishmentType.Warn };
    case 5:
     return { ...r, type: CT.PunishmentType.Tempchannelban };
    case 6:
     return { ...r, type: CT.PunishmentType.Tempban };
    case 7:
     return { ...r, type: CT.PunishmentType.Tempmute };
    default:
     return undefined;
   }
  })
  .find((r) => !!r);
};
