import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await cmd.guild.client.util.DataBase.voterewards.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await cmd.guild.client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories['vote-rewards'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.linkedid.name}: ${
   s.linkedid ? Number(s.linkedid).toString(36) : language.t.None
  } - ${[
   s.rewardxp ? `${s.rewardxp}XP` : null,
   s.rewardxpmultiplier ? `${s.rewardxpmultiplier}x` : null,
   s.rewardcurrency ? `${s.rewardcurrency} 💶` : null,
   s.rewardroles.length
    ? `${lan.fields.rewardroles.name}: ${s.rewardroles
       .slice(0, 1)
       .map((r) => cmd.guild.roles.cache.get(r)?.name ?? '-')}${
       s.rewardroles.length > 1 ? ` + ${s.rewardroles.length - 1}` : ''
      }`
    : null,
  ]
   .filter((u): u is string => !!u)
   .join(' - ')}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
