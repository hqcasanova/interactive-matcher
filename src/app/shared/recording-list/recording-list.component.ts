import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, QueryList, ViewChildren, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatListOption, MatSelectionList} from '@angular/material/list';
import { Recording } from '../recording.model';

@Component({
  selector: 'recording-list',
  templateUrl: './recording-list.component.html',
  styleUrls: ['./recording-list.component.scss'],
})
export class RecordingListComponent implements OnInit {
  
  // External recording against which recordings in this list may be compared to.
  @Input() reference: Recording | null | undefined = null;
  
  @Input() recordings: Recording[] | null = null;
  @Input() error: string = '';
  @Input() isLoading: boolean = false;
  @Input() loadMessage: string = '';

  // Emitted asynchronously to avoid digest cycle exceptions when past selection re-emerges.
  @Output() selection = new EventEmitter<Recording>(true);

  @ViewChild(MatSelectionList) list!: MatSelectionList;
  @ViewChildren(MatListOption, { read: ElementRef }) optChildrenEls!: QueryList<ElementRef>

  selectedCount: number = 0;

  /**
   * Returns all currently selected recordings, if at all.
   */
  get selected(): Recording[] {
    const selOpts = this.list.selectedOptions;

    if (selOpts.isEmpty()) {
      return [];
    }
    
    return selOpts.selected.map(item => item.value);
  }

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  /**
   * Notifies to the outside world that the selection has changed.
   * NOTE: by Material's design, changes from one selected option to another emit two events.
   */
  ngAfterViewInit() {
    this.list.selectedOptions.changed.subscribe(event => {
      this.selectedCount = this.selected.length;
      this.cdRef.detectChanges();
      
      if (this.selected.length) {
        this.selection.emit(this.selected[0]);
      } else {
        this.selection.emit();
      }
    });
  }

  /**
   * Relays to the outside world the selected option from the list as a recording.
   * Re-selection will still emit the event regardless of the option being selected already or not.
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
    const selectedEl = this.optChildrenEls.find(optChildrenEl => {
      return optChildrenEl.nativeElement.classList.contains('selected-option');
    });

    selectedEl?.nativeElement.scrollIntoView();
  }

  /**
   * Scrolls to and optionally focusses a given recording item.
   * @param recording - Object representative of recording data.
   * @param [isAutofocus = false] - If true, sets focus on the recording item after scroll.
   */
  showRecording(recording?: Recording, isAutofocus: boolean = false) {
    let index;
    let optionEl;

    if (this.recordings && recording) {
      index = this.recordings.indexOf(recording);

      if (index >= 0) {
        optionEl = this.optChildrenEls.get(index);
        optionEl?.nativeElement.scrollIntoView();

        if (isAutofocus) {
          this.list.options.get(index)?.focus();
        }
      }
    }
  }
}
