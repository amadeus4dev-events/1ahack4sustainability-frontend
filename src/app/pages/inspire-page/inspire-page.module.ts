import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';

import { InspirePageRoutingModule } from './inspire-page-routing.module';
import { InspirePageComponent } from './inspire-page.component';

@NgModule({
  declarations: [
    InspirePageComponent
  ],
  imports: [
    CommonModule,
    InspirePageRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatRadioModule,
    FormsModule
  ]
})
export class InspirePageModule {
}
