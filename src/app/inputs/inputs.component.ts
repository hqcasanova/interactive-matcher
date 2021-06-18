import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { RecordingListComponent } from '../shared/recording-list/recording-list.component';
import { Recording } from '../shared/recording.model';
import { RecordingsService } from '../shared/recordings.service';

const DATA_FOLDER = environment.dataFolder;
const SNACK_DELAY = environment.snackbarDelay;

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent implements OnInit {
  @Input() dataFile!: string;
  @Output() selection = new EventEmitter<Recording>();

  @ViewChild(RecordingListComponent) recordingList!: RecordingListComponent;
  
  selected?: Recording;
  isLoading: boolean = false;
  loadMessage: string = '';
  error: string = '';

  /**
   * Deselects any recording on changes in the recordings collection
   */
  private _recordings?: Recording[];
  get recordings(): Recording[] | undefined {
    return this._recordings;
  }
  set recordings(newValue: Recording[] | undefined) {
    this._recordings = newValue;

    if (this._recordings && this.selected && this._recordings.indexOf(this.selected) === -1) {
      this.deselectAll();
    }
  }

  constructor(
    protected recordingsService: RecordingsService,
    protected snackBar: MatSnackBar
  ) { }

  /**
   * Grabs the recordings' data as soon as the view is up and running and refreshes the latter's state.
   * @returns Observable with collection of recordings.
   */
  ngOnInit(): Observable<Recording[]> {
    const fetched$ = this.recordingsService.fetch(DATA_FOLDER + this.dataFile);
    this.updateState(fetched$, 'Fetching recordings...');

    return fetched$;
  }

  /**
   * Renders a toast notifying the user a removal triggered by a match was successful or not.
   * While at it, it updates the properties of this component.
   * @param recording - Item to be matched with and removed.
   */
  onMatch(recording?: Recording) {
    const removed$ = this.recordingsService.remove(this.recordings || [], recording);
    
    this.updateState(removed$, 'Removing matched recording...');
    removed$.subscribe(
      () => {
        this.snackBar.open('Recording removed from unmatched list', 'OK', {duration: SNACK_DELAY});
      },
      (error) => {
        this.snackBar.open('There has been an error. The recording was not removed', 'OK');
      }
    );
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
   * Reflects the state of the data transaction in terms of component property values.
   * @param obs - Observable from async data transaction.
   * @param message - Explanatory string of waiting/loading state before transaction's completion.
   * @param [collectionName = 'recordings'] - Name of the collection to be updated with new recording data.
   */
  updateState(ob$: Observable<Recording[]>, message: string, collectionName: string = 'recordings') {
    this.isLoading = true;
    this.loadMessage = message;

    ob$.pipe(
      finalize(() => {
        this.isLoading = false;
        this.loadMessage = '';
      })
    ).subscribe(
      recordings => {
        this.error = '';
        (this as any)[collectionName] = recordings;
      },
      error => {
        if (typeof error === 'string') {
          this.error = error;
        } else {
          this.error = JSON.stringify(error);
        }
      }
    );
  }
}
