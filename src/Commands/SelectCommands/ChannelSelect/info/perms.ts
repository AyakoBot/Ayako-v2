import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChannelSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const channelID = cmd.values[0];
 const member = await cmd.guild?.members.fetch(args.shift() ?? cmd.user.id).catch(() => undefined);
 const language = await ch.languageSelector(cmd.guildId);

 if (!member) {
  ch.errorCmd(cmd, language.errors.memberNotFound, language);
  return;
 }

 const channel = cmd.guild?.channels.cache.get(channelID);
 if (!channel) return;

 const permissions = channel.permissionsFor(member);
 let categoryBits = [
  [1879573680n, language.permissions.categories.GENERAL],
  [1099712954375n, language.permissions.categories.MEMBER],
  [534723950656n, language.permissions.categories.TEXT],
  [549821874944n, language.permissions.categories.VOICE],
  [4294967296n, language.permissions.categories.STAGE],
  [8589934592n, language.permissions.categories.EVENTS],
  [8n, language.permissions.categories.ADVANCED],
 ];

 let usedPermissions = new Discord.PermissionsBitField(Discord.PermissionsBitField.All);
 switch (channel.type) {
  case 0 || 11 || 12: {
   usedPermissions = new Discord.PermissionsBitField(535529258065n);
   categoryBits = [categoryBits[0], categoryBits[1], categoryBits[2]];
   break;
  }
  case 5 || 10: {
   usedPermissions = new Discord.PermissionsBitField(466809781329n);
   categoryBits = [categoryBits[0], categoryBits[1], categoryBits[2]];
   break;
  }
  case 2: {
   usedPermissions = new Discord.PermissionsBitField(558680246033n);
   categoryBits = [categoryBits[0], categoryBits[1], categoryBits[3]];
   break;
  }
  case 4: {
   usedPermissions = new Discord.PermissionsBitField(1098236034897n);
   categoryBits = [
    categoryBits[0],
    categoryBits[1],
    categoryBits[2],
    categoryBits[3],
    categoryBits[4],
   ];
   break;
  }
  case 13: {
   usedPermissions = new Discord.PermissionsBitField(13175358481n);
   categoryBits = [
    categoryBits[0],
    categoryBits[1],
    categoryBits[3],
    categoryBits[4],
    categoryBits[5],
   ];
   break;
  }
  default: {
   usedPermissions = new Discord.PermissionsBitField(Discord.PermissionsBitField.All);
   break;
  }
 }

 const categories: Discord.Collection<string | bigint, (string | null)[]> =
  new Discord.Collection();
 const allowedBits: bigint[] = [];
 const deniedBits: bigint[] = [];

 Object.entries(permissions.serialize()).forEach(([name, has]) => {
  if (!usedPermissions.has(name as Discord.PermissionsString, false)) return;
  if (has) {
   allowedBits.push(new Discord.PermissionsBitField(name as Discord.PermissionsString).bitfield);
  }
  if (!has) {
   deniedBits.push(new Discord.PermissionsBitField(name as Discord.PermissionsString).bitfield);
  }
 });

 categoryBits.forEach(([bit, name]) => {
  categories.set(name, [
   ...new Set([
    ...allowedBits
     .map((perm) =>
      new Discord.PermissionsBitField(bit as Discord.PermissionsString).has(perm, false)
       ? `${ch.stringEmotes.enabled} ${ch.permCalc(perm, language)}`
       : null,
     )
     .filter((r) => !!r),
    ...deniedBits
     .map((perm) =>
      new Discord.PermissionsBitField(bit as Discord.PermissionsString).has(perm, false)
       ? `${ch.stringEmotes.disabled} ${ch.permCalc(perm, language)}`
       : null,
     )
     .filter((r) => !!r),
   ]),
  ]);
 });

 const embed: Discord.APIEmbed = {
  fields: [],
  color: ch.constants.colors.ephemeral,
 };

 categories.forEach((perms, name) => {
  embed.fields?.push({ name: `${name}`, value: ` ${perms.join('\n')}\u200b`, inline: false });
 });

 cmd.reply({
  embeds: [embed],
  ephemeral: true,
 });
};
