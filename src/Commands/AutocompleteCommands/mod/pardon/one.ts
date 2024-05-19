import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const user = cmd.options.get('target', false)?.value as string;
 if (!user) return [];

 const type = cmd.options.getString('type', false) as
  | CT.PunishmentType.Warn
  | CT.PunishmentType.Mute
  | CT.PunishmentType.Kick
  | CT.PunishmentType.Ban
  | CT.PunishmentType.Channelban;
 if (!type) return [];

 const punishments = await cmd.guild.client.util.getPunishment(user, {
  identType: 'with-type',
  ident: type,
  guildid: cmd.guild.id,
 });

 return punishments?.splice(0, 25).map((c) => ({
  name: Number(c.uniquetimestamp).toString(36),
  value: Number(c.uniquetimestamp).toString(36),
 }));
};

export default f;
