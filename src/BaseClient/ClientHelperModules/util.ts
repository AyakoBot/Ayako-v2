export const makeCodeBlock = (text: string) => `\`\`\`${text}\`\`\``;
export const makeInlineCode = (text: string) => `\`${text}\``;
export const makeBold = (text: string) => `**${text}**`;
export const makeUnderlined = (text: string) => `__${text}__`;
export const makeSpoiler = (text: string) => `||${text}||`;
export const webhookURLToIDAndToken = (text: string) => {
  const [id, token] = text.substring(text.indexOf('webhooks/') + 9).split('/');
  return { id, token };
};
