import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.base';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public DEFAULT_AUTO_SEARCH: boolean = environment.defaultAutoSearch;
}
