import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import { Observable, of, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.base';
import { FuzzyService } from '../core/fuzzy.interface';

import { InputsComponent } from '../inputs/inputs.component';
import { RecordingsService } from '../inputs/recordings.service';
import { ConfirmDialogueComponent } from '../shared/confirm-dialogue/confirm-dialogue.component';
import { RecordingListComponent } from '../shared/recording-list/recording-list.component';
import { Recording } from '../shared/recording.model';
import { SelectDatabase } from '../shared/state/app.actions';
import { AppState } from '../shared/state/app.state';

const SNACK_DELAY = environment.snackbarDelay;

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['../inputs/inputs.component.scss', './database.component.scss'],
  providers: [ RecordingsService ]
})
export class DatabaseComponent extends InputsComponent implements OnInit {
  @Select(AppState.getAutoSearch) isAutoSearch$!: Observable<boolean>;
  @Select(AppState.getSelInput) selInput$!: Observable<Recording>;
  private selectionSubscription: Subscription;
  private autoSearchSubscription: Subscription;
  private _lastInput: Recording | undefined = undefined;
  private _lastAutoSearch: boolean | undefined = undefined;

  @Output() registered = new EventEmitter<Recording>();

  @ViewChild(RecordingListComponent) listChild!: RecordingListComponent;

  searchQuery: string | Recording = '';
  
  /**
   * Guarantees that every time an input recording is selected, this component's recordings list is
   * updated with the search results yielded by using the input recording itself as the query. It also
   * refreshes the list on auto-search enable with the search results of the last selected input recording
   * (before enabling autosearch).
   */
  constructor(
    recordingsService: RecordingsService,
    snackBar: MatSnackBar,
    store: Store,
    public fuzzyService: FuzzyService,
    public dialogue: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    super(recordingsService, snackBar, store);
    this.selectionSubscription = this.selInput$.subscribe(selInput => {
      this._lastAutoSearch && this.search(selInput);
      this._lastInput = selInput;
    });
    this.autoSearchSubscription = this.isAutoSearch$.subscribe(isAutoSearch => {
      this._lastAutoSearch = isAutoSearch;
      isAutoSearch && this.search(this._lastInput);
    });
  }

  ngOnDestroy() {
    this.selectionSubscription.unsubscribe();
    this.autoSearchSubscription.unsubscribe();
  }

  onSelection(recording: Recording) {
    this.selected = recording;
    this.store.dispatch(new SelectDatabase(recording));
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
        mergeMap((hasRec: boolean) => {
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
   * the end-user. If there is no query, the unfiltered recordings collection is rendered.
   * @param query - String being searched for.
   * @param message - Text shown while waiting for the retrieval of search results.
   */
  search(query: string | Recording | undefined, message: string = 'Searching...') {
    let searched$;
    
    if (query) {
      this.searchQuery = query;
      searched$ = this.recordingsService.fuzzySearch(query);
      this.recordings$ = this.updateState(searched$, message);
    
    } else {
      this.reset();
    }
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
    this.recordings$ = obs$;
    this.searchQuery = '';
  }
}
