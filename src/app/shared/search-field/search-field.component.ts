import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() query: string = '';

  // Avoids overlapping the non-standard "search" event
  @Output() lookup = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onSearch(event: Event) {
    const query = this.query.trim();

    event.stopPropagation();
    this.lookup.emit(query);
  }
}
