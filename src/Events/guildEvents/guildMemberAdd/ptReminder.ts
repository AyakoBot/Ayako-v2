import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (member: Discord.GuildMember) => {
 if (member.client.user.id !== ch.mainID) return;

 const guildsettings = await ch.DataBase.guildsettings.findUnique({
  where: { guildid: member.guild.id },
 });
 if (!guildsettings?.ptreminderenabled) return;

 const user = await ch.DataBase.users.findUnique({
  where: {
   userid: member.id,
  },
 });
 if (user?.ptremindersent) return;

 const dm = await ch.send(member.user, {
  embeds: [
   {
    author: {
     name: "Hi! I don't think we've met before",
     url: ch.constants.standard.invite,
    },
    title: "Here's a quick Guide to my Terms of Service and Privacy Policy",
    description:
     `At least one of the Servers you have joined uses Ayako (and possibly the Ayako Development Version) for some Features and/or Services.\n\n` +
     `**Terms of Service** https://ayakobot.com/terms\nViolation of any of these Terms can lead to your Access to Ayako being revoked.\n\n` +
     `**Privacy Policy** https://ayakobot.com/privacy\nAyako will never share or store sensitive Data or Information about you outside of Discord and outside the Discord Server you sent them in.`,
    fields: [
     {
      name: 'Premium',
      value:
       "Ayako's Service is completely free and will stay free.\nHowever, I do appreciate\nDonations on https://www.patreon.com/Lars_und_so and\nVotes on https://top.gg/bot/650691698409734151/vote",
      inline: false,
     },
     {
      name: 'Support',
      value:
       'If you have Questions or would like your Stored Data to be deleted, join the Discord Server linked to this Message and use this Channel: <#827302309368561715>',
      inline: false,
     },
     {
      name: 'Invite',
      value: `You can Invite Ayako to your Server using this link: ${ch.constants.standard.invite}`,
      inline: false,
     },
     {
      name: 'Opt-out',
      value: "You can opt-out of Ayako's Features by leaving every Mutual Server with Ayako",
      inline: false,
     },
     {
      name: 'Disabling this Reminder',
      value:
       'Server Managers can disable this Reminder with the Command </settings basic:1072246330329669726>. However we ask you to link both, the /terms and the /privacy, URLs in one of your Info Channels if you do that.',
      inline: false,
     },
    ],
    color: CT.Colors.Base,
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: 'Join Support Server',
      emoji: ch.emotes.ayakoLove,
      style: Discord.ButtonStyle.Link,
      url: 'https://discord.gg/euTdctganf',
     },
    ],
   },
  ],
  content: 'Ayako Terms and Privacy Notice',
 });
 if (!dm) return;

 API.channels.editMessage(dm.channelId, dm.id, {
  content: 'This Reminder will only be sent to you __once__\nhttps://discord.gg/gyGnkTJSyF',
 });

 ch.DataBase.users
  .upsert({
   where: { userid: member.id },
   update: {
    ptremindersent: true,
    lastfetch: Date.now(),
    avatar: member.user.displayAvatarURL(),
    username: member.user.username,
   },
   create: {
    userid: member.id,
    ptremindersent: true,
    lastfetch: Date.now(),
    avatar: member.user.displayAvatarURL(),
    username: member.user.username,
   },
  })
  .then();
};
