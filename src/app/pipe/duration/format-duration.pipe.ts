import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration } from '../../helpers/duration.helper';

@Pipe({
  name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {

  /**
   * @inheritDoc
   * @param duration
   */
  transform(duration?: string): unknown {
    return formatDuration(duration || '');
  }
}
