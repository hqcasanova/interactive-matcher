import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Recording } from './shared/recording.model';
import { AppState } from './shared/state/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Select(AppState.getSelInput) selInput$!: Observable<Recording>;
  @Select(AppState.getSelDatabase) selDatabase$!: Observable<Recording>;
}
