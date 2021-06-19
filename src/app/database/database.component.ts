import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.base';

import { InputsComponent } from '../inputs/inputs.component';
import { Recording } from '../shared/recording.model';
import { RecordingsService } from '../shared/recordings.service';

const SNACK_DELAY = environment.snackbarDelay;

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['../inputs/inputs.component.scss', './database.component.scss']
})
export class DatabaseComponent extends InputsComponent implements OnInit {
  @Input() reference?: Recording;

  searchPlaceholder: string = '';
  searchQuery: string = '';
  
  // Collection where the results of all filtering/search operations are saved to so as to preserve
  // the original copy. The collection inherited from the parent effectively caches the original recordings list.
  private _currRecordings?: Recording[];
  
  /**
   * Replicates the parent's logic for auto-deselection to keep consistency with behaviour.
   */
   get currRecordings(): Recording[] | undefined {
     return this._currRecordings;
   }
   set currRecordings(newValue: Recording[] | undefined) {
     this._currRecordings = newValue;
 
     if (this._currRecordings && this.selected && this._currRecordings.indexOf(this.selected) === -1) {
       this.deselectAll();
     }
   }
  
  constructor(recordingsService: RecordingsService, snackBar: MatSnackBar) {
    super(recordingsService, snackBar);
    this.searchPlaceholder = this.recordingsService.fuzzyKeys(' and/or ', ['isrc']) as string;
  }

  /**
   * Copies the original recordings collection as the current one so that it can be shown initally.
   */
  ngOnInit(): Observable<Recording[]> {
    const fetched$ = super.ngOnInit();
    
    fetched$.subscribe(
      recordings => {
        this.currRecordings = recordings;
      }
    );
    return fetched$;
  }

  /**
   * Notifies of progress and success/failure of adding a new recording to the list.
   * While at it, it updates the properties of this component. It also reflects the new state of the
   * recordings collection after the addition, with the side-effect that any filtering due to
   * auto-matching will be lost and all the database entries (including the new one) will be shown.
   * @param recording - Item to be added.
   */
  onRegister(recording?: Recording) {
    const added$ = this.recordingsService.add(this.recordings || [], recording);
    
    this.updateState(added$, 'Adding recording...');
    added$.subscribe(
      (recordings) => {
        this.snackBar.open('Recording registered. Showing all entries.', 'OK', {duration: SNACK_DELAY});
        this.reset();
      },
      (error) => {
        this.snackBar.open('There has been an error. The recording was not registered.', 'OK');
      }
    );
  }

  /**
   * Triggers a fuzzy search given a query or a recording. In the latter case, the values are joined
   * into the query string. Auto-matching effectively becomes a specific search, thus helping expose
   * its corresponding list state more explicitly to the end-user.
   * @param query - String being searched for.
   * @param message - Text shown while waiting for the retrieval of search results.
   */
  search(query: string | Recording, message: string = 'Searching...') {
    const searched$ = this.recordingsService.fuzzySearch(this.recordings  || [], query);
    let fuzzyKeys;
    
    if (typeof query === 'string') {
      this.searchQuery = query;
    } else {
      fuzzyKeys = this.recordingsService.fuzzyKeys() as string[];
      this.searchQuery = this.recordingsService.serialise(query, fuzzyKeys);
    }
    this.updateState(searched$, message, 'currRecordings');
  }

  /**
   * Resets the state of the list, rendering all of the database recordings.
   */
  reset() {
    this.currRecordings = this.recordings;
    this.searchQuery = '';
  }
}
