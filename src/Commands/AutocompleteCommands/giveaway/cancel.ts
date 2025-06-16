import * as CT from '../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!cmd.guild) return [];
 if (!('options' in cmd)) return [];

 if (cmd.inGuild() && !cmd.inCachedGuild()) return [];
 if (!cmd.guild) return [];

 const entered = cmd.options.getString('message-id', true);
 const giveaways = await cmd.guild.client.util.DataBase.giveaways.findMany({
  where: { guildid: cmd.guild.id },
 });
 if (!giveaways?.length) return [];

 const giveaway = giveaways
  .filter((g) =>
   entered.length ? g.msgid.includes(entered) || g.description.includes(entered) : true,
  )
  .slice(0, 25);

 return giveaway.map((g) => ({ name: g.description.slice(0, 100), value: g.msgid }));
};

export default f;
