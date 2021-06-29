import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { InputsComponent } from './inputs.component';
import { RecordingsService } from './recordings.service';

@NgModule({
  declarations: [
    InputsComponent
  ],
  imports: [ 
    SharedModule 
  ],
  providers: [
    RecordingsService
  ],
  exports: [
    InputsComponent
  ]
})
export class InputsModule { }