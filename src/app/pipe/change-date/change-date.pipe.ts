import { Pipe, PipeTransform } from '@angular/core';
import { utils } from '@dapi/sdk-core';

/**
 * Pipe that will return the number of calendar date between two dates.
 * This only consider the calendar date and ignore the time of each date.
 *
 * @example
 * {{'2022-07-22T12:15:00' | changeDate : '2022-07-23T11:15:00'}} => 1
 */
@Pipe({
  name: 'changeDate'
})
export class ChangeDatePipe implements PipeTransform {

  transform(date1?: utils.DateTime | string, date2?: utils.DateTime | string): number {
    if (!date1 || !date2) {
      return 0;
    }
    const date1WithoutHours = new utils.DateTime(date1);
    const date2WithoutHours = new utils.DateTime(date2);
    date1WithoutHours.setHours(0,0,0);
    date2WithoutHours.setHours(0,0,0);

    return Math.floor((date2WithoutHours.getTime() - date1WithoutHours.getTime()) / (3600 * 1000 * 24));
  }
}
