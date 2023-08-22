export default (token: string) => Buffer.from(token.split('.')[0], 'base64').toString();
