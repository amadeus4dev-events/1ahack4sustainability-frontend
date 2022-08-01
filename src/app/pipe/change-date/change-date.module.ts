import { NgModule } from '@angular/core';
import { ChangeDatePipe } from './change-date.pipe';

@NgModule({
  declarations: [ChangeDatePipe],
  exports: [ChangeDatePipe],
  providers: [ChangeDatePipe]
})
export class ChangeDateModule {
}
