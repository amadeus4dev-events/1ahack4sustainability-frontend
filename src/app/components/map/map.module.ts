import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChangeDateModule } from '../../pipe/change-date';
import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, ChangeDateModule],
  providers: [DatePipe],
  exports: [MapComponent]
})
export class MapModule {
}
