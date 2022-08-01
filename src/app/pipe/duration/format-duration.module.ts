import { NgModule } from '@angular/core';
import { FormatDurationPipe } from './format-duration.pipe';

@NgModule({
  declarations: [FormatDurationPipe],
  exports: [FormatDurationPipe]
})
export class FormatDurationModule {
}
