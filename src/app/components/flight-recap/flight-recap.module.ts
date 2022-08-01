import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormatDurationModule } from '../../pipe/duration';
import { FlightRecapComponent } from './flight-recap.component';

@NgModule({
  declarations: [FlightRecapComponent],
  imports: [CommonModule, MatIconModule, MatCardModule, FormatDurationModule],
  exports: [FlightRecapComponent]
})
export class FlightRecapModule {
}
