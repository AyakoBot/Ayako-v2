import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.info.badges;

 const members = cmd.guild ? await ch.fetchAllGuildMembers(cmd.guild) : undefined;
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
    color: ch.colorSelector(await ch.getBotMemberFromGuild(cmd.guild)),
    description: `${ch.stringEmotes.userFlags.DiscordEmployee} ${ch.util.makeInlineCode(
     `${ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Staff)).length,
     )}+`,
    )} ${language.userFlags.Staff} 
    ${ch.stringEmotes.userFlags.PartneredServerOwner} ${ch.util.makeInlineCode(
     ch.splitByThousand(members.filter((m) => m.user.flags?.has(Discord.UserFlags.Partner)).length),
    )} ${language.userFlags.Partner} 
    ${ch.stringEmotes.userFlags.HypesquadEvents} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Hypesquad)).length,
     ),
    )} ${language.userFlags.Hypesquad} 
    ${ch.stringEmotes.userFlags.BugHunterLevel1} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BugHunterLevel1)).length,
     ),
    )} ${language.userFlags.BugHunterLevel1} 
    ${ch.stringEmotes.userFlags.HouseBravery} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse1)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse1} 
    ${ch.stringEmotes.userFlags.HouseBrilliance} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse2)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse2} 
    ${ch.stringEmotes.userFlags.HouseBalance} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.HypeSquadOnlineHouse3)).length,
     ),
    )} ${language.userFlags.HypeSquadOnlineHouse3} 
    ${ch.stringEmotes.userFlags.EarlySupporter} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.PremiumEarlySupporter)).length,
     ),
    )} ${language.userFlags.PremiumEarlySupporter} 
    ${ch.stringEmotes.userFlags.BugHunterLevel2} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.BugHunterLevel2)).length,
     ),
    )} ${language.userFlags.BugHunterLevel2} 
    ${ch.stringEmotes.userFlags.VerifiedBot} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.VerifiedBot)).length,
     ),
    )} ${language.userFlags.VerifiedBot} 
    ${ch.stringEmotes.userFlags.EarlyVerifiedBotDeveloper} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.VerifiedDeveloper)).length,
     ),
    )} ${language.userFlags.VerifiedDeveloper} 
    ${ch.stringEmotes.userFlags.DiscordCertifiedModerator} ${ch.util.makeInlineCode(
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
    ${ch.stringEmotes.userFlags.ActiveDeveloper} ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.ActiveDeveloper)).length,
     ),
    )} ${language.userFlags.ActiveDeveloper} 
    ${ch.util.makeInlineCode(
     ch.splitByThousand(
      members.filter((m) => m.user.flags?.has(Discord.UserFlags.Quarantined)).length,
     ),
    )} ${language.userFlags.Quarantined} 
    ${ch.stringEmotes.userFlags.Nitro} ${ch.util.makeInlineCode(
     `${ch.splitByThousand(nitro.length)}+`,
    )} ${language.userFlags.Nitro} 
    `,
   },
  ],
 });
};
