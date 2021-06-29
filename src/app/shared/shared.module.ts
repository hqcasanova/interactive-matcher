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

import { RecordingItemComponent } from './recording-item/recording-item.component';
import { RecordingListComponent } from './recording-list/recording-list.component';
import { SearchFieldComponent } from './search-field/search-field.component';
import { ConfirmDialogueComponent } from './confirm-dialogue/confirm-dialogue.component';
import { FieldAccordionComponent } from './field-accordion/field-accordion.component';
import { SerialisePipe } from './serialise.pipe';
import { EnumeratePipe } from './enumerate.pipe';

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
    MatDialogModule
  ],
  providers: [
    SerialisePipe
  ],
  exports: [
    CommonModule,
    RecordingListComponent,
    SearchFieldComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatToolbarModule,
    MatChipsModule,
    FieldAccordionComponent,
    SerialisePipe,
    EnumeratePipe
  ]
})
export class SharedModule { }
