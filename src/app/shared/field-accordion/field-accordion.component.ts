import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatChipEvent, MatChipList } from '@angular/material/chips';
import { MatExpansionPanel } from '@angular/material/expansion';
import { environment } from 'src/environments/environment.base';

const ISRC_REGEX = environment.isrcRegex;

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

  /**
   * Triggers a custom event on chip removal with the text contents of the chip list.
   * @param event - Material's event object containing the removed chip.
   */
  onRemoved(event: MatChipEvent) {
    const chipsText = this.chipList.chips.reduce((acc, curr) => acc + curr.value, '');
    this.chipRemoval.emit(chipsText.replace(event.chip.value, ''));
  }

  /**
   * Splits a given string into ID-like tokens and the rest.
   * @param text - String to be split.
   * @param idRegex - Regular expression for the ID format.
   * @returns List of tokens and the rest of the string.
   * NOTE: perfect candidate for performance optimisation as it's called many times due to template.
   */
  splitIdOff(text: string, idRegex: RegExp = ISRC_REGEX): string[] {
    const idOccurrences = text.match(idRegex);
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
