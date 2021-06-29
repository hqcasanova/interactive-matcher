import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CrossActionsComponent } from './cross-actions.component';

@NgModule({
  declarations: [
    CrossActionsComponent
  ],
  imports: [ 
    SharedModule 
  ],
  exports: [
    CrossActionsComponent
  ]
})
export class CrossActionsModule { }