import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainItinerariesPageComponent } from './train-itineraries.component';

const routes: Routes = [{ path: '', component: TrainItinerariesPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainItinerariesRoutingModule { }
