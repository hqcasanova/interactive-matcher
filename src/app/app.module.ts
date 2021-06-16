import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { DatabaseComponent } from './database/database.component';
import { InputsComponent } from './inputs/inputs.component';
import { CrossActionsComponent } from './cross-actions/cross-actions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DatabaseComponent,
    InputsComponent,
    CrossActionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
