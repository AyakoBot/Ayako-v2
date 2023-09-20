import * as Discord from 'discord.js';
import stp from './stp.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (e: Discord.APIEmbed, r: Record<string, any>): Discord.APIEmbed => ({
 ...e,
 color: e.color,
 title: e.title ? stp(e.title, r) : undefined,
 description: e.description ? stp(e.description, r) : undefined,
 footer: e.footer
  ? {
     ...e.footer,
     text: stp(e.footer.text, r),
    }
  : undefined,
 author: e.author
  ? {
     ...e.author,
     name: stp(e.author.name, r),
    }
  : undefined,
 fields: e.fields?.map((f) => ({
  name: stp(f.name, r),
  value: stp(f.value, r),
  inline: f.inline,
 })),
});
