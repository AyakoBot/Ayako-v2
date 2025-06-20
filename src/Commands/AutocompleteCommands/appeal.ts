import type { AutocompleteInteraction } from 'discord.js';
import * as CT from '../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const selected = cmd.options.getFocused(true);

 console.log(selected.name);
 switch (selected.name) {
  case 'server':
   return getServers(cmd, selected.value);
  case 'punishment':
   return getPunishments(cmd, selected.value);
  default:
   return [];
 }
};

export default f;

const getServers = (cmd: AutocompleteInteraction, value: string) => {
 const getFromName = async () =>
  cmd.client.cluster!.broadcastEval(
   (cl, { name }) =>
    cl.guilds.cache
     .filter((s) => s.name.toLowerCase().includes(name.toLowerCase()))
     .map((s) => ({ name: s.name, value: s.id })),
   { context: { name: value } },
  );

 const getFromId = async () =>
  cmd.client.cluster!.broadcastEval(
   (cl, { id }) => {
    const g = cl.guilds.cache.get(id);
    if (!g) return [];

    return [{ name: g.name, value: g.id }];
   },
   { context: { id: value } },
  );

 const isId = value.match(/^\d+$/);
 if (!isId) return getFromName().then((r) => r.flat());
 return getFromId().then((r) => r.flat());
};

export const getPunishments = async (cmd: AutocompleteInteraction, value: string) => {
 const server = cmd.options.getString('server', false);
 if (!server) return [];

 const appeals = value.length
  ? []
  : await cmd.client.util.DataBase.appeals.findMany({
     where: { userid: cmd.user.id, guildid: server.length ? server : undefined },
     select: { punishmentid: true },
    });

 const punishments = await cmd.client.util.DataBase.punishments.findMany({
  where: {
   guildid: server.length ? server : undefined,
   userid: cmd.user.id,
   OR: [
    {
     uniquetimestamp: value.length
      ? parseInt(value, 36)
      : { notIn: appeals.map((a) => a.punishmentid) },
    },
    {
     reason: { contains: value, mode: 'insensitive' },
     uniquetimestamp: { notIn: appeals.map((a) => a.punishmentid) },
    },
   ],
  },
 });

 const language = await cmd.client.util.getLanguage(cmd.locale);

 return punishments.map((p) => ({
  name: `${language.punishments[p.type as keyof typeof language.punishments]}: ${p.reason}`,
  value: Number(p.uniquetimestamp).toString(36),
 }));
};
