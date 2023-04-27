import type * as Discord from 'discord.js';

import string from './string.js';
import hex from './hex.js';
import img from './img.js';
import link from './link.js';
import timestamp from './timestamp.js';

const editors = {
 string,
 hex,
 img,
 link,
 timestamp,
};

export default (cmd: Discord.StringSelectMenuInteraction) => {
 const args = cmd.values[0].split(/_+/g);

 const editor = editors[args[0] as keyof typeof editors];
 if (!editor) return;

 editor(cmd, [args[1]]);
};
