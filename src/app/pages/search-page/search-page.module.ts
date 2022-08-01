import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlightListModule } from '../../components/flight-list/flight-list.module';
import { SearchModule } from '../../components/search/search.module';

import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';

@NgModule({
  declarations: [
    SearchPageComponent,
  ],
  imports: [
    CommonModule,
    SearchPageRoutingModule,
    FlightListModule,
    SearchModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SearchPageModule {
}
