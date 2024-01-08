import type * as Discord from 'discord.js';
import Prisma from '@prisma/client';

/**
 * Converts a custom embed object from the database to a Discord API embed object.
 * @param DBembed - The custom embed object from the database.
 * @returns The Discord API embed object.
 */
export default (DBembed: Prisma.customembeds): Discord.APIEmbed => ({
 color: Number(DBembed.color),
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
