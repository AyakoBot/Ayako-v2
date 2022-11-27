import type * as DDeno from 'discordeno';
import type DBT from '../../Typings/DataBaseTypings';

export default (DBembed: DBT.customembeds): DDeno.Embed => ({
  color: Number(DBembed.color),
  title: DBembed.title,
  url: DBembed.url,
  author: DBembed.authorname
    ? {
        name: DBembed.authorname,
        iconUrl: DBembed.authoriconurl,
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
  timestamp: Number(DBembed.timestamp) || undefined,
  footer: DBembed.footertext
    ? {
        text: DBembed.footertext,
        iconUrl: DBembed.footericonurl,
      }
    : undefined,
});
