import regexes from './regexes';

export default (text: string) => regexes.emojiTester.test(text);
