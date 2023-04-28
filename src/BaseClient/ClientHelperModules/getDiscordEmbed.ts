import type * as Discord from 'discord.js';
import type DBT from '../../Typings/DataBaseTypings';

export default (DBembed: DBT.customembeds): Discord.APIEmbed => ({
 color: typeof DBembed.color === 'number' ? Number(DBembed.color) : undefined,
 title: DBembed.title,
 url: DBembed.url,
 author: DBembed.authorname
  ? {
     name: DBembed.authorname,
     icon_url: DBembed.authoricon_url,
     url: DBembed.authorurl,
    }
  : undefined,
 description: DBembed.description,
 thumbnail: DBembed.thumbnail
  ? {
     url: DBembed.thumbnail,
    }
  : undefined,
 fields: DBembed.fieldnames
  ? DBembed.fieldnames.map((fieldName, i) => {
     const fieldValue = DBembed.fieldvalues?.[i] || '\u200b';
     const fieldInline = DBembed.fieldinlines?.[i] || '\u200b';
     return { name: fieldName, value: fieldValue, inline: !!fieldInline };
    })
  : undefined,
 image: DBembed.image
  ? {
     url: DBembed.image,
    }
  : undefined,
 timestamp: DBembed.timestamp || undefined,
 footer: DBembed.footertext
  ? {
     text: DBembed.footertext,
     icon_url: DBembed.footericon_url,
    }
  : undefined,
});
