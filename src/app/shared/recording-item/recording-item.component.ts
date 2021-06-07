import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Recording } from '../recording.model';

@Component({
  selector: 'recording-item',
  templateUrl: './recording-item.component.html',
  styleUrls: ['./recording-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordingItemComponent implements OnInit {
  @Input() recording!: Recording;

  constructor() { }

  ngOnInit(): void {
  }
}
