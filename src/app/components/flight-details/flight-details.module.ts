import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MapModule } from '../map/map.module';
import { SegmentDetailsModule } from '../segment-details/segment-details.module';
import { FlightDetailsComponent } from './flight-details.component';

@NgModule({
  declarations: [FlightDetailsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MapModule,
    SegmentDetailsModule
  ],
  exports: [FlightDetailsComponent]
})
export class FlightDetailsModule {
}
