import type * as Discord from 'discord.js';
import Prisma from '@prisma/client';

export default (DBembed: Prisma.customembeds): Discord.APIEmbed => ({
 color: typeof DBembed.color === 'number' ? Number(DBembed.color) : undefined,
 title: DBembed.title ?? undefined,
 url: DBembed.url ?? undefined,
 author: DBembed.authorname
  ? {
     name: DBembed.authorname ?? undefined,
     icon_url: DBembed.authoriconurl ?? undefined,
     url: DBembed.authorurl ?? undefined,
    }
  : undefined,
 description: DBembed.description ?? undefined,
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
     text: DBembed.footertext ?? undefined,
     icon_url: DBembed.footericonurl ?? undefined,
    }
  : undefined,
});
