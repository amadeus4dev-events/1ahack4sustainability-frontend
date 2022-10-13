import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrainItinerarySearchModule } from '../../components/train-itinerary-search/train-itinerary-search.module';

import { TrainItinerariesRoutingModule } from './train-itineraries-routing.module';
import { TrainItinerariesComponent } from './train-itineraries.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    TrainItinerariesComponent,
  ],
  imports: [
    CommonModule,
    TrainItinerariesRoutingModule,
    TrainItinerarySearchModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule
  ]
})
export class TrainItinerariesModule {
}

