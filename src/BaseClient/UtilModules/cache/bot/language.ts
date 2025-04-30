import type { APIGuild, APIPartialInteractionGuild } from 'discord-api-types/v10.js';
import type Lang from '../../../Other/language.js';

/**
 * Interface for managing languages.
 */
export interface Language {
 /**
  * Sets a language on a guild.
  * @param lang - The language to set.
  * @param guildId - The id of the guild to set the language for.
  */
 set: (lang: Lang, guildId: string) => Promise<Lang>;

 /**
  * Deletes a language of a guild.
  * @param guild - The guild to delete the language for.
  */
 delete: (guild: APIGuild | APIPartialInteractionGuild) => void;

 /**
  * Gets the language of a guild.
  * @param guild - The guild to get the language for.
  */
 get: (guild: APIGuild | APIPartialInteractionGuild) => Promise<Lang>;

 /**
  * Map of guild IDs to Languages.
  */
 cache: Map<string, Lang>;
}

const self: Language = {
 set: async (lang, id) => {
  self.cache.set(id, lang);
  return lang;
 },
 delete: (guild) => {
  self.cache.delete(guild.id);
 },
 get: async (guild) =>
  self.cache.get(guild.id) ?? (await import('../../getLanguage.js')).getLanguage(guild.id),
 cache: new Map(),
};

export default self;
