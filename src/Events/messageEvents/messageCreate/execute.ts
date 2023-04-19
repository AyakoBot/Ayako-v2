import * as Discord from 'discord.js';
import auth from '../../../auth.json' assert { type: 'json' };
// @ts-ignore
import * as ch from '../../../BaseClient/ClientHelper.js';
// @ts-ignore
import fetch from 'node-fetch';

export default async (msg: Discord.Message) => {
  if (msg.author.id !== auth.ownerID) return;
  if (!msg.content.startsWith('exe')) return;
};
