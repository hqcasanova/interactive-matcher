import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InputsComponent } from '../inputs/inputs.component';
import { Recording } from '../shared/recording.model';
import { RecordingsService } from '../shared/recordings.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent extends InputsComponent implements OnInit {
  @Input() searchQuery:string = '';
  DEFAULT_FUZZY: object = environment.defaultFuzzy;

  constructor(recordingsService: RecordingsService) {
    super(recordingsService);
  }

  onRegister(recording?: Recording) {
    recording && this.updateState(this.recordingsService.add(this.recordings || [], recording));
  }
}
