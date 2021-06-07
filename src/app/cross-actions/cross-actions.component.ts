import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cross-actions',
  templateUrl: './cross-actions.component.html',
  styleUrls: ['./cross-actions.component.scss']
})
export class CrossActionsComponent implements OnInit {
  @Input() isSelInput?: boolean;
  @Input() isSelDatabase?: boolean;
  @Output() registration = new EventEmitter();
  @Output() matching = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onRegister() {
    this.registration.emit();
  }

  onMatch() {
    this.matching.emit();
  }
}
