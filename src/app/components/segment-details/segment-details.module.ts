import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDateModule } from '../../pipe/change-date';
import { FormatDurationModule } from '../../pipe/duration';
import { FormattedDateDiffModule } from '../../pipe/formatted-date-diff-duration';
import { SegmentDetailsComponent } from './segment-details.component';


@NgModule({
  declarations: [SegmentDetailsComponent],
  exports: [
    SegmentDetailsComponent
  ],
  imports: [
    CommonModule,
    FormatDurationModule,
    ChangeDateModule,
    MatIconModule,
    FormattedDateDiffModule
  ]
})
export class SegmentDetailsModule {
}
