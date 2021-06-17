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
  searchPlaceholder: string = '';
  
  // Collection where the results of all operations of filtering/search are saved to so as to preserve
  // the original copy.
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
    this.searchPlaceholder = this.recordingsService.fuzzyKeys(' and/or ') as string;
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
        this.snackBar.open('Recording added. Showing all entries.', 'OK', {duration: SNACK_DELAY});
        this.currRecordings = recordings;
      },
      (error) => {
        this.snackBar.open('There has been an error. The recording was not registered.', 'OK');
      }
    );
  }

  // TODO: dynamically change search field's value if query is a recording
  // TODO: show chips for each search term on database header => get rid of dot hint and add "clear all"
  // That should address the affordability problem of "see all".
  search(query: string | Recording, message: string = 'Searching...') {
    const searched$ = this.recordingsService.fuzzySearch(this.recordings  || [], query);
    this.updateState(searched$, message, 'currRecordings');
  }

  seeAll() {
    this.currRecordings = this.recordings;
  }
}
