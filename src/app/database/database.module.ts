import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DatabaseComponent } from './database.component';

@NgModule({
  declarations: [
    DatabaseComponent
  ],
  imports: [ 
    SharedModule 
  ],
  exports: [
    DatabaseComponent
  ]
})
export class DatabaseModule { }