import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrainItinerarySearchModule } from '../../components/train-itinerary-search/train-itinerary-search.module';

import { TrainItinerariesRoutingModule } from './train-itineraries-routing.module';
import { TrainItinerariesComponent } from './train-itineraries.component';

@NgModule({
  declarations: [
    TrainItinerariesComponent,
  ],
  imports: [
    CommonModule,
    TrainItinerariesRoutingModule,
    TrainItinerarySearchModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TrainItinerariesModule {
}

