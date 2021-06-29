import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.base';
import { FuzzyService } from '../core/fuzzy.interface';

import { InputsComponent } from '../inputs/inputs.component';
import { RecordingsService } from '../inputs/recordings.service';
import { ConfirmDialogueComponent } from '../shared/confirm-dialogue/confirm-dialogue.component';
import { RecordingListComponent } from '../shared/recording-list/recording-list.component';
import { Recording } from '../shared/recording.model';

const SNACK_DELAY = environment.snackbarDelay;

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['../inputs/inputs.component.scss', './database.component.scss']
})
export class DatabaseComponent extends InputsComponent implements OnInit {
  
  // External recording against which recordings on the database may be compared to.
  @Input() reference?: Recording;

  @Output() registered = new EventEmitter<Recording>();

  @ViewChild(RecordingListComponent) listChild!: RecordingListComponent;

  // Stream for filtered and unfiltered recordings.
  currRecordings$: Observable<Recording[]> | undefined;

  searchQuery: string | Recording = '';
  
  constructor(
    recordingsService: RecordingsService,
    snackBar: MatSnackBar, 
    public fuzzyService: FuzzyService,
    public dialogue: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {
    super(recordingsService, snackBar);
  }

  /**
   * Copies the original recordings collection as the current one so that it can be shown initally.
   */
  ngOnInit(): Observable<Recording[]> {
    return this.currRecordings$ = super.ngOnInit();
  }

  /**
   * Notifies of progress and success/failure of adding a new recording to the list.
   * While at it, it updates the properties of this component. This includes reflecting the new 
   * state of the recordings collection after the addition, with the side-effect that any filtering due to
   * auto-matching or search will be lost and all the database entries will be shown. The newly added entry
   * will be scrolled to and focussed automatically.
   * @param recording - Item to be added.
   */
  onRegister(recording?: Recording) {
    const confirmed$ = this.confirmRegister(recording);
    let added$;
    
    confirmed$.subscribe((isConfirmed) => {
      if (isConfirmed) {
        added$ = this.recordingsService.add(recording);

        this.updateState(added$, 'Adding recording...')
        .subscribe(
          (recordings) => {
            this.recordings = recordings;
            this.snackBar.open('Recording registered. Showing all entries.', 'OK', {duration: SNACK_DELAY});
            this.reset();
            this.cdRef.detectChanges();
            this.listChild.showRecording(recording, true);
            this.registered.emit(recording);
          },

          //TODO: use multiple actions or an actionable word to show full error details on a separate modal if so wished.
          (error) => {
            this.snackBar.open('There has been an error. The recording was not registered.', 'OK');
          }
        );
      }
    });
  }

  /**
   * Checks that the new entry's ISRC is unique. If not, confirmation is sought from the user 
   * through a modal before carrying on with the registration.
   * @param recording - Recording provided for test.
   * @returns Observable with true if the recording's ISRC is unique or the user decides to carry on.
   */
  confirmRegister(recording: Recording | undefined): Observable<boolean> {
    const hasRec$ = this.recordingsService.hasRecording(recording);
    
    if (recording) {
      return hasRec$.pipe(
        switchMap((hasRec: boolean) => {
          if (hasRec) {
            return this.dialogue.open(ConfirmDialogueComponent, { data: {
              title: 'ISRC already registered',
              body: `The ISRC number <span class="highlight">${recording?.isrc}</span> for the unmatched 
                    recording you are about to register is not unique: there are other registered recordings
                    with the same ISRC. Do you still wish to continue registering the unmatched recording?`,
              action: 'Register'
            }}).afterClosed();
          
          // No previous recording with same ISRC => just carry on without confirmation
          } else {
            return of(true);
          }
        })
      );

    // No recording passed in => what were you thinking? Abort!
    } else {
      return of(false);
    }
  }

  /**
   * Triggers a fuzzy search given a query or a recording. Auto-matching effectively becomes
   * a specific search, thus helping expose its corresponding list state more explicitly to
   * the end-user.
   * @param query - String being searched for.
   * @param message - Text shown while waiting for the retrieval of search results.
   */
  search(query: string | Recording, message: string = 'Searching...') {
    const searched$ = this.recordingsService.fuzzySearch(query);

    this.searchQuery = query;
    this.currRecordings$ = this.updateState(searched$, message);
  }

  /**
   * Resets the state of the list, rendering all of the database recordings. Note that any current
   * selection is kept.
   */
  reset() {
    let obs$ = undefined;

    if (this.recordings) {
      obs$ = of(this.recordings);
    }
    this.currRecordings$ = obs$;
    this.searchQuery = '';
  }
}
