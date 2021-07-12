import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { RecordingItemComponent } from './recording-item/recording-item.component';
import { RecordingListComponent } from './recording-list/recording-list.component';
import { SearchFieldComponent } from './search-field/search-field.component';
import { ConfirmDialogueComponent } from './confirm-dialogue/confirm-dialogue.component';
import { FieldAccordionComponent } from './field-accordion/field-accordion.component';
import { SerialisePipe } from './serialise.pipe';
import { EnumeratePipe } from './enumerate.pipe';

import { AppState } from './state/app.state';

@NgModule({
  declarations: [
    RecordingItemComponent,
    RecordingListComponent,
    SearchFieldComponent,
    ConfirmDialogueComponent,
    FieldAccordionComponent,
    SerialisePipe,
    EnumeratePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatToolbarModule,
    MatChipsModule,
    MatDialogModule,
    NgxsModule.forRoot([
      AppState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [
    SerialisePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    RecordingListComponent,
    SearchFieldComponent,
    FieldAccordionComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatToolbarModule,
    MatChipsModule,
    MatSlideToggleModule,
    SerialisePipe,
    EnumeratePipe
  ]
})
export class SharedModule { }
