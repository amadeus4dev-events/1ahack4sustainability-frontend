import { Pipe, PipeTransform } from '@angular/core';
import { utils } from '@dapi/sdk-core';

const timeUnitMap = [
  {regExp: '{dd}', inMs: 60 * 60 * 1000 * 24, pad: true},
  {regExp: '{d}', inMs: 60 * 60 * 1000 * 24, pad: false},
  {regExp: '{hh}', inMs: 60 * 60 * 1000, pad: true},
  {regExp: '{h}', inMs: 60 * 60 * 1000, pad: false},
  {regExp: '{mm}', inMs: 60 * 1000, pad: true},
  {regExp: '{m}', inMs: 60 * 1000, pad: false},
];

/**
 * Compute the duration between two dates and format it according to the pattern provided in parameters
 * It will return a duration and does not consider the calendar date changes (for the latter, see {@link ChangeDatePipe})
 *
 * @example
 * {{'2022-07-22T23:50:00' | changeDate : '2022-07-23T01:05:00' : '{{hh}}H {{mm}}min'}} => 01H 15min
 */
@Pipe({
  name: 'formattedDateDiffDuration'
})
export class FormattedDateDiffPipe implements PipeTransform {

  transform(date1?: utils.DateTime, date2?: utils.DateTime, format = '{hh}:{mm}'): string {
    if (!date1 || !date2) {
      return '';
    }
    return timeUnitMap
      .filter((timeUnit) => format.indexOf(timeUnit.regExp) > -1)
      .reduce(({formattedString, rest}, timeUnit, index) => {
        const diff = Math.trunc(rest / timeUnit.inMs);
        return {
          formattedString: formattedString.replace(timeUnit.regExp, timeUnit.pad ? diff.toString().padStart(2, '0') : diff.toString()),
          rest: rest - diff * timeUnit.inMs
        };
      }, {
        formattedString: format,
        rest: new utils.Date(date2).getTime() - new utils.Date(date1).getTime()
      }).formattedString;
  }
}
