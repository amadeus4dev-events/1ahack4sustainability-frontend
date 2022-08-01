import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlightDetailsModule } from '../flight-details/flight-details.module';
import { FlightRecapModule } from '../flight-recap/flight-recap.module';
import { FlightListComponent } from './flight-list.component';

@NgModule({
  declarations: [FlightListComponent],
  imports: [
    CommonModule,
    FlightDetailsModule,
    FlightRecapModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  exports: [FlightListComponent]
})
export class FlightListModule {
}
