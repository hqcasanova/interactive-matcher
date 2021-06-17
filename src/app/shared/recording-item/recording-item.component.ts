import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Recording } from '../recording.model';

@Component({
  selector: 'recording-item',
  templateUrl: './recording-item.component.html',
  styleUrls: ['./recording-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordingItemComponent implements OnInit {
  durMilliseconds: number = 0;
  
  private _recording!: Recording;
  @Input() 
  get recording() {
    return this._recording;
  }
  set recording(data: Recording) {
    this._recording = data;
    this.durMilliseconds = +this.recording.duration * 1000;
  } 

  constructor() { 
  }

  ngOnInit(): void {
  }
}
