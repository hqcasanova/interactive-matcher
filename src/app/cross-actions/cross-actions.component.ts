import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cross-actions',
  templateUrl: './cross-actions.component.html',
  styleUrls: ['./cross-actions.component.scss']
})
export class CrossActionsComponent implements OnInit {
  @Input() isSelInput?: boolean;
  @Input() isSelDatabase?: boolean;
  @Input() isAutoSearch: boolean = true;
  @Output() registration = new EventEmitter();
  @Output() matching = new EventEmitter();

  constructor(private snackBar: MatSnackBar) { }

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
}
