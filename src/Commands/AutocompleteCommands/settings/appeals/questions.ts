import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await cmd.guild.client.util.DataBase.appealquestions.findMany({
   where: { guildid: cmd.guild.id },
  })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await cmd.guild.client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories.questions;

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.question.name}: ${
   s.question ? (s.question?.slice(0, 50) ?? language.t.None) : language.t.None
  } - ${lan.fields.answertype.name}: ${
   language.answertypes[s.answertype as keyof typeof language.answertypes]
  }`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
