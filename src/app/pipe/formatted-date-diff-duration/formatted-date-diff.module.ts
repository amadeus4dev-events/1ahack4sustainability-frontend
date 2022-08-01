import { NgModule } from '@angular/core';
import { FormattedDateDiffPipe } from './formatted-date-diff.pipe';

@NgModule({
  declarations: [FormattedDateDiffPipe],
  exports: [FormattedDateDiffPipe],
  imports: []
})
export class FormattedDateDiffModule {
}
