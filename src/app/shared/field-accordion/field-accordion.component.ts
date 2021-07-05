import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatChipEvent, MatChipList } from '@angular/material/chips';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'field-accordion',
  templateUrl: './field-accordion.component.html',
  styleUrls: ['./field-accordion.component.scss']
})
export class FieldAccordionComponent implements OnInit {
  @Input() fieldValue: string = '';
  @Input() expandText: string = 'Expand';
  @Output() afterExpansion = new EventEmitter();
  @Output() chipRemoval = new EventEmitter();

  @ViewChild('panel') panel!: MatExpansionPanel;
  @ViewChild(MatChipList) chipList!: MatChipList;

  constructor() { }

  ngOnInit(): void {
  }

  onAfterExpand() {
    this.afterExpansion.emit();
  }

  onRemoved(event: MatChipEvent) {
    const chipsText = this.chipList.chips.reduce((acc, curr) => acc + curr.value, '');
    this.chipRemoval.emit(chipsText.replace(event.chip.value, ''));
  }

  splitIdOff(text: string) {
    const idOccurrences = text.match(/[A-Z0-9]{12}/g);
    let splitText = idOccurrences || [];
    let textWithoutId = text;

    idOccurrences?.forEach(id => {
      return textWithoutId = textWithoutId.replace(id, '');
    });

    if (textWithoutId.length) {
      splitText = splitText.concat([textWithoutId])
    }

    return splitText;
  }

  /**
   * Adds/remove a class depending on whether the mouse hovers onto/away of the delete chip control.
   * @param event - DDOM event for enter/leave mouse action
   * @param isAdd - True if the class should be added.
   */
  onDeleteChipHover(event: any, isAdd: boolean) {
    if (event.target.classList.contains('mat-chip-remove')) {
      event.currentTarget.classList.toggle('delete', isAdd);
    }
  }

  onPanelToggle() {
    this.panel.toggle();
  }
}
