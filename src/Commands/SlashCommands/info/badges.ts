import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) {
  cmd.client.util.guildOnly(cmd);
  return;
 }
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.badges;

 const members = cmd.guild.members.cache.map((c) => c);
 if (!members) return;

 const nitro = members.filter(
  (m) => m.user.avatar?.startsWith('a_') || m.user.banner || m.avatar?.startsWith('a_'),
 );

 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    color: cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
    description: `${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.DiscordEmployee,
    )} ${cmd.client.util.util.makeInlineCode(
     `${cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Staff)).length,
     )}+`,
    )} ${language.userFlags.Staff} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.PartneredServerOwner,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Partner)).length,
     ),
    )} ${language.userFlags.Partner} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.HypesquadEvents,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Hypesquad)).length,
     ),
    )} ${language.userFlags.Hypesquad} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.BugHunterLevel1,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BugHunterLevel1)).length,
     ),
    )} ${language.userFlags.BugHunterLevel1} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.HouseBravery,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse1)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse1} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.HouseBrilliance,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse2)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse2} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.HouseBalance,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse3)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse3} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.EarlySupporter,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.PremiumEarlySupporter)).length,
     ),
    )} ${language.userFlags.PremiumEarlySupporter} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.BugHunterLevel2,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BugHunterLevel2)).length,
     ),
    )} ${language.userFlags.BugHunterLevel2} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.VerifiedBot[0],
    )}${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.VerifiedBot[1],
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.VerifiedBot)).length,
     ),
    )} ${language.userFlags.VerifiedBot} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.EarlyVerifiedBotDeveloper,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.VerifiedDeveloper)).length,
     ),
    )} ${language.userFlags.VerifiedDeveloper} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.DiscordCertifiedModerator,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.CertifiedModerator)).length,
     ),
    )} ${language.userFlags.CertifiedModerator} 
    ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BotHTTPInteractions)).length,
     ),
    )} ${language.userFlags.BotHTTPInteractions} 
    ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Spammer)).length,
     ),
    )} ${language.userFlags.Spammer} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.ActiveDeveloper,
    )} ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.ActiveDeveloper)).length,
     ),
    )} ${language.userFlags.ActiveDeveloper} 
    ${cmd.client.util.util.makeInlineCode(
     cmd.client.util.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Quarantined)).length,
     ),
    )} ${language.userFlags.Quarantined} 
    ${cmd.client.util.constants.standard.getEmote(
     cmd.client.util.emotes.userFlags.Nitro,
    )} ${cmd.client.util.util.makeInlineCode(
     `${cmd.client.util.splitByThousand(nitro.length)}+`,
    )} ${language.userFlags.Nitro} 
    `,
   },
  ],
 });
};
