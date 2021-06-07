import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Recording } from '../recording.model';

@Component({
  selector: 'recording-list',
  templateUrl: './recording-list.component.html',
  styleUrls: ['./recording-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordingListComponent implements OnInit {
  @Input() recordings?: Recording[];
  @Input() error: string = "";
  @Input() isLoading: boolean = false; 
  @Output() selection = new EventEmitter<Recording>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Relays to the outside world the selected option from the list as a recording.
   * @param selection - Selection object with data on chosen list row.
   */
  onSelection(selection: MatSelectionListChange) {
    this.selection.emit(selection.options[0].value);
  }
}
