/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Discord from 'discord.js';
// @ts-ignore
import fetch from 'node-fetch';
import auth from '../../../auth.json' assert { type: 'json' };
// @ts-ignore
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (msg: Discord.Message) => {
 if (msg.author.id !== auth.ownerID) return;
 if (!msg.content.startsWith('exe')) return;

 console.log(Discord.parseEmoji('AMayakoPat:1055865566314897408'));
};
