import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import autocompleteHandler from './autocompleteHandler.js';
import buttonHandler from './buttonHandler.js';
import commandHandler from './commandHandler.js';
import contextCommandHandler from './contextCommandHandler.js';
import modalHandler from './modalHandler.js';
import selectHandler from './selectHandler.js';

export default async (cmd: Discord.Interaction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (cmd.inGuild() && cmd.guild) ch.firstGuildInteraction(cmd.guild);

 commandHandler(cmd);
 buttonHandler(cmd);
 modalHandler(cmd);
 contextCommandHandler(cmd);
 selectHandler(cmd);
 autocompleteHandler(cmd);
};
