import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 switch (true) {
  case member.guild.id === '298954459172700181':
   animekos(member);
   break;
  case member.guild.id === '366219406776336385':
   gameverse(member);
   break;
  case member.guild.id === '390037305659883521':
   pockytime(member);
   break;
  case member.guild.id === '637683844988010546':
   reiko(member);
   break;
  default:
   break;
 }
};

const reiko = async (member: Discord.GuildMember) => {
 const channel = await member.client.util.request.users.createDM(
  member.guild,
  member.user.id,
  member.client,
 );
 if ('message' in channel) return;

 member.client.util.request.channels.sendMessage(
  member.guild,
  channel.id,
  {
   content: `<:RC_Booster:976508507685814313> Check out our lovely Partners:

https://discord.gg/animekos?ref=reiko
https://discord.gg/twitch?ref=reiko
https://discord.gg/pocky?ref=reiko`,
  },
  member.client,
 );
};

const pockytime = async (member: Discord.GuildMember) => {
 const channel = await member.client.util.request.users.createDM(
  member.guild,
  member.user.id,
  member.client,
 );
 if ('message' in channel) return;

 member.client.util.request.channels.sendMessage(
  member.guild,
  channel.id,
  {
   content: `୨  Welcome! Here's some of our partnered discord servers <3

⠀    ୨  -  -  -  -  ︵ ︵ ︵
⠀ ⠀\`🍰\`┊[Bee's Nest ( !! HUGE VOUCH !! )]( https://discord.gg/honeybee )
⠀ ⠀\`🌸\`┊[X-Zone ( !! HUGE VOUCH !! )]( https://discord.gg/xzone )
⠀ ⠀\`🍰\`︰[Night Raid]( https://discord.gg/twitch?ref=pockytime )
⠀ ⠀\`🌸\`┊[Reiko's Cybercafe]( https://discord.gg/happy?ref=pockytime )
⠀ ⠀\`🍰\`︰[The TeaHouse]( https://discord.gg/sip )
⠀ ⠀\`🌸\`┊[Kokoro]( https://discord.gg/kokoro )
⠀ ⠀\`🍰\`︰[Animekos]( https://discord.gg/animekos?ref=pockytime )

・୨・┈┈┈┈・୨୧・┈┈┈┈・୧・`,
  },
  member.client,
 );
};

const animekos = async (member: Discord.GuildMember) => {
 // @ts-ignore
 const channel = (await member.createDM()) as Discord.DMChannel;

 // @ts-ignore
 channel.send({
  content: `<:AMayakoLove:874102206176034826> Check out our lovely Partners:
  
https://discord.gg/WGRbUwqkwG?ref=animekos
https://discord.gg/QjMDJTE2ns?ref=animekos
https://discord.gg/PkqBwtMup4?ref=animekos
https://discord.gg/pocky?ref=animekos`,
 });
};

const gameverse = async (member: Discord.GuildMember) => {
 // @ts-ignore
 const channel = (await member.createDM()) as Discord.DMChannel;

 // @ts-ignore
 channel.send({
  content: `<:AMayakoLove:874102206176034826> Check out our lovely Sister Server:
https://discord.gg/animekos?ref=gameverse`,
 });
};
