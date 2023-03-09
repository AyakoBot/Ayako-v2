import moment from 'moment';
import 'moment-duration-format';
import type * as CT from '../../Typings/CustomTypings';

export default (duration: number, language: CT.Language) =>
  !duration
    ? language.None
    : moment
        .duration(duration)
        .format(
          `y [${language.time.years}], M [${language.time.months}], d [${language.time.days}], h [${language.time.hours}], m [${language.time.minutes}], s [${language.time.seconds}]`,
          { trim: 'all' },
        );
