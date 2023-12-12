import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'ban' | 'kick';
 const language = await ch.getLanguage(cmd.guild.id);
 const file = cmd.message.attachments.find((a) => a.name === 'caught_users_ids.txt');

 if (!file) {
  ch.errorCmd(cmd, language.errors.fileNotFound, language);
  return;
 }

 const text = await ch.txtFileLinkToString(file.url);
 if (!text) {
  ch.errorCmd(cmd, language.errors.fileNotFound, language);
  return;
 }

 const idArray = text
  .split(/\r?\n/)
  .map((c) => c.split(/\s+/))
  .flat();
 if (!idArray) return;

 runPunishment(language, idArray, type, cmd.guild, cmd);
};

export const runPunishment = async (
 language: CT.Language,
 idArray: string[],
 type: 'ban' | 'kick',
 guild: Discord.Guild,
 cmd?: Discord.ButtonInteraction<'cached'>,
) => {
 const self = (await ch.getBotMemberFromGuild(guild)) ?? guild.members.me;
 if (!self) {
  ch.error(guild, new Error('Cant find self'));
  return [];
 }

 const loadingEmbed = ch.loadingEmbed({ language, lan: { author: language.t.loading } });
 const failed: string[] = [];
 const success: string[] = [];
 const embeds = [
  {
   author: loadingEmbed.author,
   color: ch.constants.colors.success,
   description: language.events.guildMemberAdd.antiraid[
    type === 'kick' ? 'kickingSuccess' : 'banningSuccess'
   ](success.length),
  },
  {
   author: loadingEmbed.author,
   color: ch.constants.colors.danger,
   description: language.events.guildMemberAdd.antiraid[
    type === 'kick' ? 'kickingError' : 'banningError'
   ](failed.length),
  },
 ];

 if (cmd) await ch.replyCmd(cmd, { embeds });

 const job = Jobs.scheduleJob('*/5 * * * * *', () => {
  cmd?.editReply({
   embeds: [
    {
     ...embeds[0],
     description: language.events.guildMemberAdd.antiraid[
      type === 'kick' ? 'kickingSuccess' : 'banningSuccess'
     ](success.length),
    },
    {
     ...embeds[1],
     description: language.events.guildMemberAdd.antiraid[
      type === 'kick' ? 'kickingError' : 'banningError'
     ](failed.length),
    },
   ],
  });
 });

 const cancelJob = Jobs.scheduleJob(new Date(Date.now() + 120000), () => {
  job.cancel();
 });

 // eslint-disable-next-line no-async-promise-executor
 await new Promise(async (resolve) => {
  const checkDone = () => {
   if (idArray.length !== success.length + failed.length) return;
   resolve(undefined);
  };

  idArray.forEach(async (id) => {
   const member = guild.members.cache.get(id);

   switch (type) {
    case 'ban': {
     if (!ch.isBannable(self, member)) {
      failed.push(id);
      checkDone();
      return;
     }
     break;
    }
    case 'kick': {
     if (!member) {
      failed.push(id);
      checkDone();
      return;
     }

     if (!ch.isKickable(self, member)) {
      failed.push(id);
      checkDone();
      return;
     }
     break;
    }
    default: {
     failed.push(id);
     checkDone();
     return;
    }
   }

   const res = await (type === 'kick'
    ? ch.request.guilds.removeMember(guild, id)
    : ch.request.guilds.banUser(
       guild,
       id,
       { delete_message_seconds: 604800 },
       language.autotypes.antivirus,
      ));
   if (res && 'message' in (res as Discord.DiscordAPIError | NonNullable<unknown>)) {
    failed.push(id);
    checkDone();
    return;
   }
   success.push(id);
   checkDone();
  });
 });

 cancelJob.cancel();
 job.cancel();

 embeds[0] = {
  ...embeds[0],
  author: {
   name: language.t.Done,
   icon_url: ch.emotes.tickWithBackground.link,
  },
  description: language.events.guildMemberAdd.antiraid[
   type === 'kick' ? 'kickingSuccess' : 'banningSuccess'
  ](success.length),
 };
 embeds[1] = {
  ...embeds[1],
  author: {
   name: language.t.Done,
   icon_url: ch.emotes.tickWithBackground.link,
  },
  description: language.events.guildMemberAdd.antiraid[
   type === 'kick' ? 'kickingError' : 'banningError'
  ](failed.length),
 };

 cmd?.editReply({
  embeds,
 });

 return embeds;
};
