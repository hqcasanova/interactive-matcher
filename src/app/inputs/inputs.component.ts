import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Recording } from '../shared/recording.model';
import { RecordingsService } from '../shared/recordings.service';

const DATA_FOLDER = environment.dataFolder;

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent implements OnInit {
  @Input() dataFile!: string;
  @Output() selection = new EventEmitter<Recording>();
  
  recordings?: Recording[];
  selected?: Recording;
  serialRecording: string = '';
  isLoading: boolean = false;
  error: string = '';

  constructor(protected recordingsService: RecordingsService) { }

  ngOnInit(): void {
    this.updateState(this.recordingsService.fetch(DATA_FOLDER + this.dataFile));
  }

  onMatch(recording?: Recording) {
    recording && this.updateState(this.recordingsService.remove(this.recordings || [], recording));
  }

  onSelection(recording: Recording) {
    this.selected = recording;
    this.serialRecording = this.recordingsService.serialise(recording);
    this.selection.emit(recording);
  }

  /**
   * Reflects the state of the data transaction in terms of component property values.
   * @param obs - Observable from async data transaction.
   */
  updateState(obs: Observable<Recording[]>) {
    this.isLoading = true;
    obs.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(
      recordings => {
        this.error = '';
        this.recordings = recordings;
      },
      error => {
        if (typeof error === 'string') {
          this.error = error;
        } else {
          this.error = JSON.stringify(error);
        }
      }
    );
  }
}
