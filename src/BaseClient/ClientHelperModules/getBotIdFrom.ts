import * as Discord from 'discord.js';
import DataBase from '../DataBase.js';

export const token = (t: string) => Buffer.from(t.split('.')[0], 'base64').toString();

export const guild = async (g: Discord.Guild) => {
 const settings = await DataBase.guildsettings.findUnique({
  where: { guildid: g.id, token: { not: null } },
 });
 if (!settings) return g.client.user.id;

 return token(settings.token as string);
};
