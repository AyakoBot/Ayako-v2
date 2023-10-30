import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const user = cmd.options.get('target', false)?.value as string;
 if (!user) return [];

 const type = cmd.options.getString('type', false) as
  | 'warn'
  | 'mute'
  | 'kick'
  | 'ban'
  | 'channelban';
 if (!type) return [];

 const punishments = await ch.getPunishment(user, {
  identType: 'with-type',
  ident: type,
  guildid: cmd.guild.id,
 });

 return punishments?.splice(0, 25).map((c) => ({
  name: Number(c.uniquetimestamp).toString(36),
  value: c.uniquetimestamp.toString(),
 }));
};

export default f;
