import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainItinerariesComponent } from './train-itineraries.component';

const routes: Routes = [{ path: '', component: TrainItinerariesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainItinerariesRoutingModule { }
