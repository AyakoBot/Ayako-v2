import type * as DDeno from 'discordeno';
import notYours from './notYours';
import buttonRower from './buttonRower';
import client from '../DDenoClient';
import InteractionCollector from '../Other/InteractionCollector';

export default async (msg: DDeno.Message, language: typeof import('../../Languages/en.json')) => {
  const buttons: DDeno.ButtonComponent[] = [
    {
      customId: 'proceed',
      label: language.mod.warning.proceed,
      style: 4,
      emoji: client.objectEmotes.warning,
      type: 2,
    },
    {
      customId: 'abort',
      label: language.mod.warning.abort,
      style: 2,
      emoji: {
        id: BigInt(client.objectEmotes.cross.id),
        name: client.objectEmotes.cross.name,
        animated: client.objectEmotes.cross.animated,
      },
      type: 2,
    },
  ];

  const m = await reply(msg, {
    content: language.mod.warning.text,
    components: buttonRower([buttons]),
    allowedMentions: { repliedUser: true },
  });

  if (!m) return false;

  const collector = new InteractionCollector(m, 30000);
  return new Promise((resolve) => {
    collector.on('collect', (answer) => {
      if (answer.user.id !== msg.authorId) notYours(answer, language);
      else if (answer.customId === 'proceed') {
        m.delete().catch(() => null);
        resolve(true);
      } else if (answer.customId === 'abort') {
        m.delete().catch(() => null);
        resolve(false);
      }
    });
    collector.on('end', (reason) => {
      if (reason === 'time') {
        resolve(false);
        m.delete().catch(() => null);
      }
    });
  });
};
