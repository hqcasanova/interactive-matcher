import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

  onAfterExpand() {
    this.afterExpansion.emit();
  }

  onRemoved() {
    this.chipRemoval.emit();
  }

  onDeleteChipClass(event: any, isAdd: boolean) {
    if (event.target.classList.contains('mat-chip-remove')) {
      event.currentTarget.classList.toggle('delete', isAdd);
    }
  }

  onPanelToggle() {
    this.panel.toggle();
  }

}
