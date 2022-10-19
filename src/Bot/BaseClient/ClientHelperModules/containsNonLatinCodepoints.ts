import regexes from './regexes.js';

export default (text: string) => regexes.emojiTester.test(text);
