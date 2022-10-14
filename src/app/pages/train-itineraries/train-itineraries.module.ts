import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrainItinerariesSearchModule } from '../../components/train-itineraries-search/train-itineraries-search.module';

import { TrainItinerariesRoutingModule } from './train-itineraries-routing.module';
import { TrainItinerariesPageComponent } from './train-itineraries.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    TrainItinerariesPageComponent,
  ],
  imports: [
    CommonModule,
    TrainItinerariesRoutingModule,
    TrainItinerariesSearchModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule
  ]
})
export class TrainItinerariesModule {
}

