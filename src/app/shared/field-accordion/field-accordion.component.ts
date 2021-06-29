import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  onAfterExpand() {
    this.afterExpansion.emit();
  }

  onRemoved() {
    this.chipRemoval.emit();
  }

}
