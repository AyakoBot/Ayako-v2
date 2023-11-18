import moment from 'moment';
import 'moment-duration-format';
import * as CT from '../../Typings/CustomTypings.js';

/**
 * Formats the given duration in years, months, days, hours, minutes and seconds.
 * @param duration - The duration to format in milliseconds.
 * @param language - The language object containing translations for the time units.
 * @returns A formatted string representing the duration in years,
 * months, days, hours, minutes and seconds.
 */
export default (duration: number, language: CT.Language) =>
 !duration
  ? language.t.None
  : moment
     .duration(duration)
     .format(
      `y [${language.time.years}], M [${language.time.months}], d [${language.time.days}], h [${language.time.hours}], m [${language.time.minutes}], s [${language.time.seconds}]`,
      { trim: 'all' },
     );
