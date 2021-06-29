import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { RecordingListComponent } from '../shared/recording-list/recording-list.component';
import { Recording } from '../shared/recording.model';
import { RecordingsService } from './recordings.service';

const SNACK_DELAY = environment.snackbarDelay;

// This component assumes a list allowing only one selected item at a time.
// TODO: maybe pass in current DB list and use change detection on it to generalise this list's update ops.
// eg: not highlighting ISRC of selected recording if no other DB/input recording exists with the same ISRC
@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent implements OnInit {
  @Input() dataFile!: string;
  @Output() selection = new EventEmitter<Recording>();

  @ViewChild(RecordingListComponent) recordingList!: RecordingListComponent;
  
  // Acts as a cached copy of the original recordings list. Useful when filtering.
  recordings?: Recording[];

  recordings$!: Observable<Recording[]>;
  selected?: Recording;
  isLoading: boolean = false;
  loadMessage: string = '';
  error: string = '';

  constructor(
    protected recordingsService: RecordingsService,
    protected snackBar: MatSnackBar
  ) { }

  /**
   * Grabs the recordings' data as soon as the view is up and running and refreshes the latter's state.
   * @returns Observable with collection of recordings.
   */
  ngOnInit(): Observable<Recording[]> {
    const fetched$ = this.recordingsService.load(this.dataFile);
    
    this.recordings$ = this.updateState(fetched$, 'Fetching recordings...').pipe(
      tap(recordings => this.recordings = recordings)
    );

    return this.recordings$;
  }

  /**
   * Renders a toast notifying the user a removal triggered by a match was successful or not.
   * While at it, it updates the properties of this component.
   * @param recording - Item to be matched with and removed.
   */
  onMatch(recording?: Recording) {
    const removed$ = this.recordingsService.remove(recording);
    
    this.recordings$ = this.updateState(removed$, 'Removing matched recording...').pipe(
      
      //TODO: use actionable text to expose error thrown in a modal
      catchError(error => {
        this.snackBar.open('There has been an error. The recording was not removed', 'OK');
        return throwError(error);
      }),

      tap(recordings => {
        this.recordings = recordings;
        this.snackBar.open('Recording removed from unmatched list', 'OK', {duration: SNACK_DELAY});
      })
    );
  }

  /**
   * Deselects any recordings no longer present in the changed recordings collection. Otherwise,
   * the "select" property may still hold a selection that no longer applies, potentially allowing
   * operations that shouldn't happen if they depend on that selection.
   * @param currRecordings - Changed collection.
   */
  onRecordingsChange(currRecordings: Recording[]) {
    if (this.selected && this.recordings?.indexOf(this.selected) === -1) {
      this.deselectAll();
    }
  }


  onSelection(recording: Recording) {
    this.selected = recording;
    this.selection.emit(recording);
  }

  
  deselectAll() {
    this.recordingList.deselectAll();
    this.selected = undefined;
  }

  
  /**
   * Reflects the loading state of the data transaction.
   * @param obs - Observable from async data transaction.
   * @param message - Explanatory string of waiting/loading state before transaction's completion.
   */
  updateState(ob$: Observable<Recording[]>, message: string): Observable<any> {
    this.isLoading = true;
    this.loadMessage = message;

    return ob$.pipe(
      catchError(error => {
        if (typeof error === 'string' || error.toString) {
          this.error = error;
        } else {
          this.error = JSON.stringify(error);
        }
        return throwError(this.error);
      }),

      finalize(() => {
        this.isLoading = false;
        this.loadMessage = '';
      })
    );
  }
}
