/* eslint-disable @typescript-eslint/no-explicit-any */
import auth from '../auth.json' assert { type: 'json' };

export default (expression: string, obj: { [key: string]: any }) => {
  const text = (e: string) => {
    const t = e.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, value: string) => {
      const newValue = value.split('.');
      let decided: any;
      const Result = obj[newValue[0]];
      if (Result) {
        if (newValue.length > 1) {
          newValue.forEach((element: any, i) => {
            if (i === 1) decided = Result[element];
            if (i > 1) decided = decided[element];
          });
          return decided;
        }
        return Result;
      }
      return substring;
    });
    return t;
  };
  return text(expression).replace(RegExp(auth.token, 'g'), 'TOKEN');
};
