import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from './inputs/inputs.module';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';
import { CrossActionsModule } from './cross-actions/cross-actions.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    InputsModule,
    DatabaseModule,
    CrossActionsModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
