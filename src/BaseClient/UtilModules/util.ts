/**
 * Returns a string wrapped in a code block.
 * @param text - The string to be wrapped in a code block.
 * @returns A string wrapped in a code block.
 */
export const makeCodeBlock = (text: string) => `\`\`\`${text}\`\`\``;
/**
 * Wraps the given text in inline code markdown.
 * @param text - The text to be wrapped.
 * @returns The text wrapped in inline code markdown.
 */
export const makeInlineCode = (text: string) => `\`${text}\``;
/**
 * Makes the given text bold by wrapping it in double asterisks.
 * @param text - The text to make bold.
 * @returns The bolded text.
 */
export const makeBold = (text: string) => `**${text}**`;
/**
 * Returns the given text wrapped in double underscores to make it underlined.
 * @param text - The text to be underlined.
 * @returns The underlined text.
 */
export const makeUnderlined = (text: string) => `__${text}__`;
/**
 * Wraps the given text in spoiler tags.
 * @param text - The text to be wrapped in spoiler tags.
 * @returns The given text wrapped in spoiler tags.
 */
export const makeSpoiler = (text: string) => `||${text}||`;
/**
 * Extracts the ID and token from a Discord webhook URL.
 * @param text The webhook URL to extract from.
 * @returns An object containing the ID and token.
 */
export const webhookURLToIDAndToken = (text: string) => {
 const [id, token] = text.substring(text.indexOf('webhooks/') + 9).split('/');
 return { id, token };
};
