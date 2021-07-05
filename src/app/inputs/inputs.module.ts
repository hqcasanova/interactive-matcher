import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { InputsComponent } from './inputs.component';

@NgModule({
  declarations: [
    InputsComponent
  ],
  imports: [ 
    SharedModule 
  ],
  providers: [],
  exports: [
    InputsComponent
  ]
})
export class InputsModule { }