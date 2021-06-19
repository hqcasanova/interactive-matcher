import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() query: string = '';
  @ViewChild('searchInput') searchInput!: MatInput;

  // Avoids overlapping the non-standard "search" event
  @Output() lookup = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void { 
  }

  focus() {
    this.searchInput.focus();
  }

  onSearch(event: Event) {
    const query = this.query.trim();

    event.stopPropagation();
    this.lookup.emit(query);
  }
}
