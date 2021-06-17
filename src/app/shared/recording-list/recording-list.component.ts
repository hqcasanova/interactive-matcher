import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Recording } from '../recording.model';

@Component({
  selector: 'recording-list',
  templateUrl: './recording-list.component.html',
  styleUrls: ['./recording-list.component.scss'],
})
export class RecordingListComponent implements OnInit {
  @Input() recordings?: Recording[];
  @Input() reference?: Recording;
  @Input() error: string = '';
  @Input() isLoading: boolean = false;
  @Input() loadMessage: string = '';
  @Output() selection = new EventEmitter<Recording>();

  @ViewChild(MatSelectionList) list!: MatSelectionList;
  @ViewChildren(MatListOption, { read: ElementRef }) optionEls!: QueryList<ElementRef>

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Relays to the outside world the selected option from the list as a recording.
   * Re-selection will still emit the event regardless of the option already being selected.
   * @param recording - Item on recordings list that was clicked on.
   */
  onSelection(recording: Recording) {
    this.selection.emit(recording);
  }

  /**
   * Exposes list's deselection method.
   */
  deselectAll() {
    this.list.deselectAll();
  }

  /**
   * Scrolls the topmost selected recording into view.
   */
  showSelected() {
    const selectedEl = this.optionEls.find(optionEl => {
      return optionEl.nativeElement.classList.contains('selected-option');
    });

    selectedEl?.nativeElement.scrollIntoView();
  }
}
