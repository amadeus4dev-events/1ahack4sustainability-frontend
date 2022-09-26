import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./pages/home-page/home-page.module').then(m => m.HomePageModule)},
  {
    path: 'inspire',
    loadChildren: () => import('./pages/inspire-page/inspire-page.module').then(m => m.InspirePageModule)
  },
  {path: 'search', loadChildren: () => import('./pages/search-page/search-page.module').then(m => m.SearchPageModule)},
  { path: 'TrainItineraries', loadChildren: () => import('./pages/train-itineraries/train-itineraries.module').then(m => m.TrainItinerariesModule) },

  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
