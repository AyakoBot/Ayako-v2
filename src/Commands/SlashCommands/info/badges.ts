import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.badges;

 const members = cmd.guild.members.cache.map((c) => c);
 if (!members) return;

 const nitro = members.filter(
  (m) => m.user.avatar?.startsWith('a_') || m.user.banner || m.avatar?.startsWith('a_'),
 );

 ch.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    color: ch.getColor(await ch.getBotMemberFromGuild(cmd.guild)),
    description: `${ch.constants.standard.getEmote(
     ch.emotes.userFlags.DiscordEmployee,
    )} ${ch.util.makeInlineCode(
     `${ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Staff)).length,
     )}+`,
    )} ${language.userFlags.Staff} 
    ${ch.constants.standard.getEmote(
     ch.emotes.userFlags.PartneredServerOwner,
    )} ${ch.util.makeInlineCode(
     ch.splitByThousand(members.filter((m) => m.user.flags?.has(Discord.UserFlags.Partner)).length),
    )} ${language.userFlags.Partner} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.HypesquadEvents)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Hypesquad)).length,
     ),
    )} ${language.userFlags.Hypesquad} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.BugHunterLevel1)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BugHunterLevel1)).length,
     ),
    )} ${language.userFlags.BugHunterLevel1} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.HouseBravery)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse1)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse1} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.HouseBrilliance)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse2)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse2} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.HouseBalance)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse3)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse3} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.EarlySupporter)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.PremiumEarlySupporter)).length,
     ),
    )} ${language.userFlags.PremiumEarlySupporter} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.BugHunterLevel2)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BugHunterLevel2)).length,
     ),
    )} ${language.userFlags.BugHunterLevel2} 
    ${ch.constants.standard.getEmote(
     ch.emotes.userFlags.VerifiedBot[0],
    )}${ch.constants.standard.getEmote(
     ch.emotes.userFlags.VerifiedBot[1],
    )} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.VerifiedBot)).length,
     ),
    )} ${language.userFlags.VerifiedBot} 
    ${ch.constants.standard.getEmote(
     ch.emotes.userFlags.EarlyVerifiedBotDeveloper,
    )} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.VerifiedDeveloper)).length,
     ),
    )} ${language.userFlags.VerifiedDeveloper} 
    ${ch.constants.standard.getEmote(
     ch.emotes.userFlags.DiscordCertifiedModerator,
    )} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.CertifiedModerator)).length,
     ),
    )} ${language.userFlags.CertifiedModerator} 
    ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BotHTTPInteractions)).length,
     ),
    )} ${language.userFlags.BotHTTPInteractions} 
    ${ch.util.makeInlineCode(
     ch.splitByThousand(members.filter((m) => m.user.flags?.has(Discord.UserFlags.Spammer)).length),
    )} ${language.userFlags.Spammer} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.ActiveDeveloper)} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.ActiveDeveloper)).length,
     ),
    )} ${language.userFlags.ActiveDeveloper} 
    ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Quarantined)).length,
     ),
    )} ${language.userFlags.Quarantined} 
    ${ch.constants.standard.getEmote(ch.emotes.userFlags.Nitro)} ${ch.util.makeInlineCode(
     `${ch.splitByThousand(nitro.length)}+`,
    )} ${language.userFlags.Nitro} 
    `,
   },
  ],
 });
};
