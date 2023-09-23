import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const member = await ch.request.guilds.getMember(cmd.guild, args.shift() ?? cmd.user.id);
 if ('message' in member) {
  ch.errorCmd(cmd, member.message, language);
  return;
 }

 const allPerms = new Discord.PermissionsBitField(Discord.PermissionsBitField.All).toArray();
 const allowedBits: bigint[] = [];
 const deniedBits: bigint[] = [];

 allPerms.forEach((_, i) => {
  const p = Object.entries(member.permissions.serialize())[i] as [
   Discord.PermissionsString,
   boolean,
  ];

  if (p[1]) allowedBits.push(new Discord.PermissionsBitField(p[0]).bitfield);
  if (!p[1]) deniedBits.push(new Discord.PermissionsBitField(p[0]).bitfield);
 });

 const categories: Discord.Collection<string | bigint, (string | null)[]> =
  new Discord.Collection();

 const categoryBits = [
  [1879573680n, language.permissions.categories.GENERAL],
  [1099712954375n, language.permissions.categories.MEMBER],
  [534723950656n, language.permissions.categories.TEXT],
  [554116842240n, language.permissions.categories.VOICE],
  [4294967296n, language.permissions.categories.STAGE],
  [8589934592n, language.permissions.categories.EVENTS],
  [8n, language.permissions.categories.ADVANCED],
 ];

 categoryBits.forEach(([bit, name]) => {
  categories.set(name, [
   ...new Set([
    ...allowedBits
     .map((perm) =>
      new Discord.PermissionsBitField(bit as Discord.PermissionsString).has(perm, false)
       ? `${ch.constants.standard.getEmote(ch.emotes.enabled)} ${ch.permCalc(perm, language, true)}`
       : null,
     )
     .filter((r) => !!r),
    ...deniedBits
     .map((perm) =>
      new Discord.PermissionsBitField(bit as Discord.PermissionsString).has(perm, false)
       ? `${ch.constants.standard.getEmote(ch.emotes.disabled)} ${ch.permCalc(
          perm,
          language,
          true,
         )}`
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
