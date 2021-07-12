import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Recording } from '../shared/recording.model';
import { SetAutoSearch } from '../shared/state/app.actions';
import { AppState } from '../shared/state/app.state';

@Component({
  selector: 'app-cross-actions',
  templateUrl: './cross-actions.component.html',
  styleUrls: ['./cross-actions.component.scss']
})
export class CrossActionsComponent implements OnInit {
  @Select(AppState.getAutoSearch) isAutoSearch$!: Observable<boolean>;
  
  @Input() isSelInput!: Recording | null;
  @Input() isSelDatabase!: Recording | null;
  @Output() registration = new EventEmitter();
  @Output() matching = new EventEmitter();

  constructor(private snackBar: MatSnackBar, private store: Store) { }

  ngOnInit(): void {
  }

  onRegister() {
    if (this.isSelInput) {
      this.registration.emit();
    } else {
      this.snackBar.open('Please select an unmatched recording first', 'OK');
    }
  }

  onMatch() {
    if (this.isSelInput && this.isSelDatabase) {
      this.matching.emit();
    } else {
      this.snackBar.open('Please select an unmatched and a registered recording first', 'OK');
    }
  }

  onAutoSearchChange(toggleChange: MatSlideToggleChange) {
    this.store.dispatch(new SetAutoSearch(toggleChange.checked));
  }
}
